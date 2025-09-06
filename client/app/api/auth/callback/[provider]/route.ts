import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";
import { createSession } from "@/lib/session";

// Helper function to decode JWT base64url payload
function decodeJWTPayload(token: string) {
  try {
    // Validate JWT format (should have 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format: token should have 3 parts");
    }

    const base64UrlPayload = parts[1];
    if (!base64UrlPayload) {
      throw new Error("Invalid JWT format: missing payload");
    }

    // Convert base64url to base64 by replacing characters and adding padding
    const base64Payload = base64UrlPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(base64UrlPayload.length + (4 - base64UrlPayload.length % 4) % 4, '=');

    const decoded = JSON.parse(atob(base64Payload));

    // Validate that we have the essential fields
    if (!decoded.sub || !decoded.email) {
      throw new Error("Invalid JWT payload: missing required fields (sub, email)");
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT payload:", error);
    throw new Error(`Invalid JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const access_token = searchParams.get("access_token");
  const id_token = searchParams.get("id_token");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const provider = params.provider;

  console.log("OAuth callback - Provider:", provider);
  console.log("OAuth callback - Access token received:", !!access_token);
  console.log("OAuth callback - ID token received:", !!id_token);
  console.log("OAuth callback - Code received:", !!code);
  console.log("OAuth callback - State:", state);
  console.log("OAuth callback - Error:", error);
  console.log("OAuth callback - All params:", Object.fromEntries(searchParams.entries()));

  // Check for OAuth errors first
  if (error) {
    console.error("OAuth error received:", error);
    const errorRedirectUrl = process.env.NODE_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa") + `/?error=oauth_${error}`
      : new URL(`/?error=oauth_${error}`, request.url).toString();
    return NextResponse.redirect(errorRedirectUrl);
  }

  // For successful OAuth flow, we should have either:
  // 1. Both access_token and id_token (LinkedIn success flow)
  // 2. Just access_token (Google flow)
  // 3. Just code (initial OAuth callback - needs token exchange)

  if (access_token && id_token) {
    // This is the final successful OAuth callback with tokens
    // Try to authenticate with Strapi first, but fallback to direct user creation if that fails
    console.log("Processing successful OAuth tokens - need to authenticate with Strapi");

    try {
      // Decode the ID token to get user information
      const idTokenPayload = decodeJWTPayload(id_token);
      console.log("ID token payload:", idTokenPayload);

      // Try to call Strapi to register/authenticate the user and get a Strapi JWT
      const backendUrl = getStrapiURL();
      const authUrl = new URL(backendUrl + `/api/auth/${provider}/callback`);

      // Pass the tokens to Strapi
      authUrl.searchParams.append('access_token', access_token);
      authUrl.searchParams.append('id_token', id_token);

      console.log("Authenticating with Strapi:", authUrl.href);

      const res = await fetch(authUrl.href);
      const data = await res.json();

      console.log("Strapi response status:", res.status);
      console.log("Strapi response data:", data);

      // Check if authentication was successful
      if (res.ok && data.jwt) {
        console.log("Creating session with Strapi JWT");

        // Create a session payload with the JWT and user data from Strapi
        const sessionPayload = {
          jwt: data.jwt, // Use Strapi JWT
          user: data.user,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };

        // Create the session
        await createSession(sessionPayload);
        console.log("Session created successfully with Strapi JWT");
      } else {
        // Strapi authentication failed, try direct user registration/login
        console.log("Strapi authentication failed, attempting direct user creation");

        // Try to register/login user directly with Strapi using extracted user info
        const uniquePassword = `OAuth${provider}${idTokenPayload.sub}${Date.now()}!`; // Ensure strong password
        const userPayload = {
          email: idTokenPayload.email,
          username: idTokenPayload.email.split('@')[0] + '_' + provider, // Make username unique
          password: uniquePassword,
          confirmed: true, // Auto-confirm OAuth users
        };

        // Try to register user first
        const registerUrl = new URL(backendUrl + '/api/auth/local/register');
        console.log("Registration payload:", JSON.stringify(userPayload, null, 2));
        
        const registerRes = await fetch(registerUrl.href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPayload)
        });

        let authResult = null;

        if (registerRes.ok) {
          authResult = await registerRes.json();
          console.log("User registered successfully:", authResult);
        } else {
          // Registration failed, try login instead
          const registerError = await registerRes.json();
          console.log("Registration failed with status:", registerRes.status);
          console.log("Registration error:", registerError);
          console.log("Attempting login instead");
          const loginUrl = new URL(backendUrl + '/api/auth/local');
          const loginPayload = {
            identifier: idTokenPayload.email,
            password: uniquePassword
          };
          console.log("Login payload:", JSON.stringify(loginPayload, null, 2));
          
          const loginRes = await fetch(loginUrl.href, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginPayload)
          });

          if (loginRes.ok) {
            authResult = await loginRes.json();
            console.log("User logged in successfully:", authResult);
          } else {
            const loginError = await loginRes.json();
            console.log("Login failed with status:", loginRes.status);
            console.log("Login error:", loginError);
            throw new Error("Both registration and login failed");
          }
        }

        if (authResult && authResult.jwt) {
          // Create a session payload with the JWT and user data
          const sessionPayload = {
            jwt: authResult.jwt,
            user: authResult.user,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          };

          // Create the session
          await createSession(sessionPayload);
          console.log("Session created successfully with direct auth");
        } else {
          throw new Error("Failed to get JWT from authentication");
        }
      }

      // Redirect to home page
      const redirectUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
        : new URL("/", request.url).toString();

      console.log("Redirecting to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);

    } catch (decodeError) {
      console.error("Error processing OAuth tokens:", decodeError);

      // Log the raw token for debugging (first and last 20 characters only for security)
      if (id_token) {
        const tokenPreview = id_token.length > 40
          ? `${id_token.substring(0, 20)}...${id_token.substring(id_token.length - 20)}`
          : id_token;
        console.error("ID token preview:", tokenPreview);
        console.error("ID token length:", id_token.length);
      }

      const errorRedirectUrl = process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa") + "/?error=token_decode_failed"
        : new URL("/?error=token_decode_failed", request.url).toString();
      return NextResponse.redirect(errorRedirectUrl);
    }
  }  // If we only have access_token (Google flow) or code (initial callback), process via Strapi
  if (access_token || code) {
    console.log("Processing OAuth via Strapi callback");

    const backendUrl = getStrapiURL();
    const path = `/api/auth/${provider}/callback`;
    const url = new URL(backendUrl + path);

    // Copy all search parameters from the original request to Strapi
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    console.log("Full Strapi callback URL:", url.href);

    const res = await fetch(url.href);
    const data = await res.json();

    console.log("Strapi response status:", res.status);
    console.log("Strapi response data:", data);

    // Check if authentication was successful
    if (!res.ok || !data.jwt) {
      console.error("OAuth authentication failed:", data);
      const errorRedirectUrl = process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa") + "/?error=auth_failed"
        : new URL("/?error=auth_failed", request.url).toString();
      return NextResponse.redirect(errorRedirectUrl);
    }

    console.log("Creating session for user");

    // Create a session payload with the JWT and user data from Strapi
    const sessionPayload = {
      jwt: data.jwt,
      user: data.user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Create the session using the session management system
    await createSession(sessionPayload);

    console.log("Redirecting to home after successful authentication");

    // Use absolute URL for production to avoid localhost redirects
    const redirectUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
      : new URL("/", request.url).toString();

    console.log("Redirect URL:", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // If we get here, we don't have the required parameters
  console.log("No valid OAuth parameters received, redirecting to home");
  const noParamsRedirectUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
    : new URL("/", request.url).toString();
  return NextResponse.redirect(noParamsRedirectUrl);
}