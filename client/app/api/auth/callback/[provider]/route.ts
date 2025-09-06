import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";
import { createSession } from "@/lib/session";

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
    // This is the final successful OAuth callback from Strapi with tokens
    console.log("Processing successful OAuth tokens from Strapi");

    try {
      // Decode the ID token to get user information
      const idTokenPayload = JSON.parse(atob(id_token.split('.')[1]));
      console.log("ID token payload:", idTokenPayload);

      // Create user object from ID token
      const user = {
        id: idTokenPayload.sub,
        username: idTokenPayload.name || idTokenPayload.email.split('@')[0],
        email: idTokenPayload.email,
        name: idTokenPayload.name,
        given_name: idTokenPayload.given_name,
        family_name: idTokenPayload.family_name,
        picture: idTokenPayload.picture,
        provider: provider,
        confirmed: true,
        blocked: false,
      };

      // Create a session payload
      const sessionPayload = {
        jwt: access_token, // Use access token as JWT
        user: user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      // Create the session
      await createSession(sessionPayload);
      console.log("Session created successfully for LinkedIn user");

      // Redirect to home page
      const redirectUrl = process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
        : new URL("/", request.url).toString();

      console.log("Redirecting to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);

    } catch (decodeError) {
      console.error("Error processing ID token:", decodeError);
      const errorRedirectUrl = process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa") + "/?error=token_decode_failed"
        : new URL("/?error=token_decode_failed", request.url).toString();
      return NextResponse.redirect(errorRedirectUrl);
    }
  }

  // If we only have access_token (Google flow) or code (initial callback), process via Strapi
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