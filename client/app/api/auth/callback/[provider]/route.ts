import { NextResponse } from "next/server";
import { getStrapiURL } from "@/lib/utils";
import { createSession } from "@/lib/session";

// Helper functions
function getRedirectUrl(request: Request, error?: string): string {
  const baseUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
    : new URL("/", request.url).origin;

  return error ? `${baseUrl}/?error=${error}` : baseUrl;
}

async function authenticateWithStrapi(provider: string, searchParams: URLSearchParams): Promise<any> {
  const backendUrl = getStrapiURL();
  const url = new URL(`${backendUrl}/api/auth/${provider}/callback`);

  // Create a clean set of parameters for Strapi
  const cleanParams = new URLSearchParams();

  if (provider === 'linkedin') {
    // For LinkedIn, only send the essential parameters that Strapi can handle
    const code = searchParams.get('code');
    const access_token = searchParams.get('access_token');
    const id_token = searchParams.get('id_token');
    const state = searchParams.get('state');

    if (code) cleanParams.set('code', code);
    if (access_token) cleanParams.set('access_token', access_token);
    if (id_token) cleanParams.set('id_token', id_token);
    if (state) cleanParams.set('state', state);
  } else {
    // For other providers, forward all parameters
    searchParams.forEach((value, key) => {
      cleanParams.append(key, value);
    });
  }

  // Append clean parameters to the URL
  cleanParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  console.log(`Authenticating with Strapi for ${provider}:`, url.toString());

  const response = await fetch(url.href);
  const data = await response.json();

  console.log(`Strapi ${provider} response status:`, response.status);
  console.log(`Strapi ${provider} response data:`, data);

  if (!response.ok || !data.jwt) {
    // Log more detailed error information
    console.error(`Strapi authentication failed for ${provider}:`, {
      status: response.status,
      statusText: response.statusText,
      data: data,
      url: url.toString()
    });
    throw new Error(`Strapi authentication failed: ${data.message || data.error?.message || 'Unknown error'}`);
  }

  return data;
}

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const provider = params.provider;
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error for ${provider}:`, error);
    return NextResponse.redirect(getRedirectUrl(request, `oauth_${error}`));
  }

  // Validate required OAuth parameters
  const access_token = searchParams.get("access_token");
  const code = searchParams.get("code");
  const id_token = searchParams.get("id_token");

  // For LinkedIn, we might receive id_token instead of access_token
  if (!access_token && !code && !id_token) {
    console.error(`Missing OAuth parameters for ${provider}:`, {
      access_token: !!access_token,
      code: !!code,
      id_token: !!id_token,
      allParams: Object.fromEntries(searchParams.entries())
    });
    return NextResponse.redirect(getRedirectUrl(request, "missing_oauth_params"));
  }

  console.log(`OAuth parameters for ${provider}:`, {
    hasAccessToken: !!access_token,
    hasCode: !!code,
    hasIdToken: !!id_token,
    provider: provider
  });

  try {
    // Authenticate with Strapi
    const authData = await authenticateWithStrapi(provider, searchParams);

    // Create session
    const sessionPayload = {
      jwt: authData.jwt,
      user: authData.user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    await createSession(sessionPayload);

    console.log(`OAuth authentication successful for ${provider}`);
    return NextResponse.redirect(getRedirectUrl(request));

  } catch (authError) {
    console.error(`Authentication failed for ${provider}:`, authError);
    return NextResponse.redirect(getRedirectUrl(request, "auth_failed"));
  }
}