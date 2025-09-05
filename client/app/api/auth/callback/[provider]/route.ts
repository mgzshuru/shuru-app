import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const provider = params.provider;

  // Get the correct base URL for redirects
  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

  console.log(`OAuth ${provider} callback received:`, {
    code: code ? 'present' : 'missing',
    error,
    state,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth ${provider} error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, baseUrl)
    );
  }

  if (!code) {
    console.error(`No authorization code received from ${provider}. Full URL:`, request.url);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('No authorization code received')}`, baseUrl)
    );
  }

  try {
    // Exchange code for tokens with Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

    // Send the authorization code to Strapi for token exchange
    const tokenResponse = await fetch(`${strapiUrl}/api/auth/${provider}/callback?code=${code}${state ? `&state=${state}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error(`Strapi ${provider} callback error:`, errorData);
      throw new Error(`OAuth ${provider} callback failed: ${errorData}`);
    }

    const authData = await tokenResponse.json();
    console.log(`Strapi ${provider} response:`, authData);

    // Check if we have the required data
    if (!authData.jwt || !authData.user) {
      console.error(`Invalid response from Strapi ${provider} callback:`, authData);
      throw new Error(`Invalid authentication response from ${provider}`);
    }

    // Create session with the received data
    await createSession({
      user: authData.user,
      jwt: authData.jwt,
    });

    console.log(`OAuth ${provider} success for user:`, authData.user.email);

    // Redirect to profile page
    return NextResponse.redirect(new URL('/profile', baseUrl));

  } catch (error) {
    console.error(`OAuth ${provider} callback error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, baseUrl)
    );
  }
}
