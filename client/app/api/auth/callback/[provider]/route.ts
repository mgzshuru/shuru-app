import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("access_token");
  const provider = params.provider;

  console.log("OAuth callback - Provider:", provider);
  console.log("OAuth callback - Token received:", !!token);

  if (!token) {
    console.log("No token received, redirecting to home");
    const noTokenRedirectUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
      : new URL("/", request.url).toString();
    return NextResponse.redirect(noTokenRedirectUrl);
  }

  const backendUrl = getStrapiURL();
  const path = `/api/auth/${provider}/callback`;

  console.log("Calling Strapi callback:", backendUrl + path);

  console.log("Calling Strapi callback:", backendUrl + path);

  const url = new URL(backendUrl + path);
  url.searchParams.append("access_token", token);

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

  console.log("Setting JWT cookie");
  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, config);

  console.log("Redirecting to home after successful authentication");

  // Use absolute URL for production to avoid localhost redirects
  const redirectUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://shuru.sa"
    : new URL("/", request.url).toString();

  console.log("Redirect URL:", redirectUrl);
  return NextResponse.redirect(redirectUrl);
}