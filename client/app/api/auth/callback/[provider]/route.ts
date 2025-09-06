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

  // Forward all OAuth parameters to Strapi
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.href);
  const data = await response.json();

  if (!response.ok || !data.jwt) {
    throw new Error(`Strapi authentication failed: ${data.message || 'Unknown error'}`);
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

  if (!access_token && !code) {
    console.error(`Missing OAuth parameters for ${provider}`);
    return NextResponse.redirect(getRedirectUrl(request, "missing_oauth_params"));
  }

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