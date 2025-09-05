import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : undefined
    : "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("access_token");
  const provider = params.provider;

  if (!token) {
    const redirectUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || "/"
      : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const backendUrl = getStrapiURL();
  const path = `/api/auth/${provider}/callback`;

  const url = new URL(backendUrl + path);
  url.searchParams.append("access_token", token);

  const res = await fetch(url.href);
  const data = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, config);

  const redirectUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "/"
    : "/";
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}