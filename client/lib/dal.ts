import "server-only";

import { cookies } from "next/headers";

import { decrypt, deleteSession } from "./session";

import { cache } from "react";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;

  // If no cookie exists, return early
  if (!cookie) {
    return { isAuth: false, session: null };
  }

  const session = await decrypt(cookie);

  // If decryption failed or session is null, clear the invalid cookie and return
  if (!session) {
    // Delete the invalid session cookie
    await deleteSession();
    return { isAuth: false, session: null };
  }

  // Check if session has required jwt property
  if (!session?.jwt) {
    // Delete the invalid session cookie
    await deleteSession();
    return { isAuth: false, session: null };
  }

  return { isAuth: true, session };
});