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
  const token = searchParams.get("access_token");
  const code = searchParams.get("code"); // LinkedIn uses code parameter
  const state = searchParams.get("state"); // OAuth state parameter
  const error = searchParams.get("error"); // OAuth error parameter
  const provider = params.provider;

  console.log("OAuth callback - Provider:", provider);
  console.log("OAuth callback - Token received:", !!token);
  console.log("OAuth callback - Code received:", !!code);
  console.log("OAuth callback - State:", state);
  console.log("OAuth callback - Error:", error);

  // Check for OAuth errors first
  if (error) {
    console.error("OAuth error received:", error);
    const errorRedirectUrl = process.env.NODE_ENV === "production"
      ? (process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa") + `/?error=oauth_${error}`
      : new URL(`/?error=oauth_${error}`, request.url).toString();
    return NextResponse.redirect(errorRedirectUrl);
  }

  // Check for either token (Google) or code (LinkedIn)
  if (!token && !code) {
    console.log("No token or code received, redirecting to home");
    const noTokenRedirectUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
      : new URL("/", request.url).toString();
    return NextResponse.redirect(noTokenRedirectUrl);
  }

  const backendUrl = getStrapiURL();
  const path = `/api/auth/${provider}/callback`;

  console.log("Calling Strapi callback:", backendUrl + path);

  // For LinkedIn, we need to pass all the original parameters to Strapi
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