import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const provider = params.provider;

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth ${provider} error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }

  if (!code) {
    console.error(`No authorization code received from ${provider}`);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('No authorization code received')}`, request.url)
    );
  }

  try {
    // Exchange code for tokens with Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const callbackUrl = `${strapiUrl}/api/auth/${provider}/callback`;

    // Create the full callback URL with the code
    const tokenResponse = await fetch(`${callbackUrl}?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error(`Strapi ${provider} callback error:`, errorData);
      throw new Error(`OAuth ${provider} callback failed`);
    }

    const authData = await tokenResponse.json();

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

    // Redirect to profile page
    return NextResponse.redirect(new URL('/profile', request.url));

  } catch (error) {
    console.error(`OAuth ${provider} callback error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}
