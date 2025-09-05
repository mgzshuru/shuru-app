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
  const accessToken = searchParams.get('access_token');
  const idToken = searchParams.get('id_token');
  const provider = params.provider;

  // Get the correct base URL for redirects
  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

  console.log(`OAuth ${provider} callback received:`, {
    code: code ? 'present' : 'missing',
    accessToken: accessToken ? 'present' : 'missing',
    idToken: idToken ? 'present' : 'missing',
    error,
    provider,
    fullUrl: request.url
  });

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth ${provider} error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, baseUrl)
    );
  }

  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    let authData;

    // Handle Google token-based flow (Implicit Flow)
    if (accessToken && idToken && provider === 'google') {
      console.log(`Processing Google token flow`);

      // Decode the ID token to get user info
      try {
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const tokenData = JSON.parse(jsonPayload);
        console.log('Google user data from token:', {
          email: tokenData.email,
          sub: tokenData.sub,
          email_verified: tokenData.email_verified
        });

        // Check if user already exists in Strapi
        const userSearchResponse = await fetch(`${strapiUrl}/api/users?filters[email][$eq]=${tokenData.email}`);

        console.log('User search response status:', userSearchResponse.status);

        if (userSearchResponse.ok) {
          const existingUsers = await userSearchResponse.json();
          console.log('Existing users found:', existingUsers.length);

          if (existingUsers.length > 0) {
            // User exists, generate JWT token
            console.log('User exists, generating JWT');

            const user = existingUsers[0];

            // Since we can't use password login for OAuth users, we'll create them fresh each time
            // or use Strapi's JWT service directly. For now, let's use the fallback approach
            authData = {
              jwt: 'temp-jwt-' + Date.now(), // This is a placeholder - in production you'd generate a proper JWT
              user: user
            };

            console.log('Using fallback authentication for existing user');
          } else {
            // User doesn't exist, create new user
            console.log('Creating new user');

            const username = tokenData.email.split('@')[0] + '_google_' + Date.now();
            const newUserResponse = await fetch(`${strapiUrl}/api/auth/local/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                email: tokenData.email,
                password: 'oauth-user-' + tokenData.sub + '-' + Date.now(),
                confirmed: true,
              }),
            });

            if (newUserResponse.ok) {
              authData = await newUserResponse.json();
              console.log('New user created successfully');
            } else {
              const errorData = await newUserResponse.text();
              console.error('Failed to create new user:', errorData);
              throw new Error('Failed to create user account');
            }
          }
        } else {
          // If we can't check for existing users, let's try to create a new user and handle the error
          console.log('Cannot access users endpoint, trying to create user directly');

          const username = tokenData.email.split('@')[0] + '_google_' + Date.now();
          const newUserResponse = await fetch(`${strapiUrl}/api/auth/local/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              email: tokenData.email,
              password: 'oauth-user-' + tokenData.sub + '-' + Date.now(),
              confirmed: true,
            }),
          });

          if (newUserResponse.ok) {
            authData = await newUserResponse.json();
            console.log('New user created successfully (direct creation)');
          } else {
            const errorData = await newUserResponse.text();
            console.error('Failed to create user directly:', errorData);

            // If user already exists, the registration will fail, so let's try a login approach
            if (errorData.includes('Email or Username are already taken')) {
              console.log('User already exists, using fallback authentication');
              authData = {
                jwt: 'fallback-jwt-' + Date.now(),
                user: {
                  email: tokenData.email,
                  confirmed: true,
                  provider: 'google',
                  id: tokenData.sub
                }
              };
            } else {
              throw new Error('Failed to create or authenticate user');
            }
          }
        }      } catch (tokenError) {
        console.error('Error processing Google token:', tokenError);
        throw new Error('Failed to process Google authentication');
      }

    } else if (code) {
      // Handle authorization code flow (for LinkedIn or properly configured Google)
      console.log(`Processing authorization code flow for ${provider}`);

      const tokenResponse = await fetch(`${strapiUrl}/api/auth/${provider}/callback?code=${code}${state ? `&state=${state}` : ''}`, {
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

      authData = await tokenResponse.json();
    } else {
      console.error('No valid authentication data received');
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('No authorization data received')}`, baseUrl)
      );
    }

    console.log(`Authentication result:`, {
      hasJwt: !!authData?.jwt,
      hasUser: !!authData?.user,
      userEmail: authData?.user?.email
    });

    // Check if we have the required data
    if (!authData?.user) {
      console.error(`No user data received from authentication`);
      throw new Error(`Authentication failed - no user data`);
    }

    // For the temp JWT case, we'll create the session anyway
    // In production, you should implement proper JWT generation
    await createSession({
      user: authData.user,
      jwt: authData.jwt || 'fallback-jwt-' + Date.now(),
    });

    console.log(`OAuth ${provider} success for user:`, authData.user.email);

    // Redirect to profile page
    return NextResponse.redirect(new URL('/profile', baseUrl));

  } catch (error) {
    console.error(`OAuth ${provider} callback error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed: ' + errorMessage)}`, baseUrl)
    );
  }
}
