"use server";

import { demoAccount } from "@huddle/database/demo-account";
import { cookies, headers } from "next/headers";
import { authLib } from "@/lib/auth";

export async function setVerificationEmail(email: string) {
  const cookieStore = await cookies();

  cookieStore.set("verification-email", email, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://"),
    sameSite: "lax",
    maxAge: 15 * 60,
  });
}

/**
 * Signs the visitor in as the seeded demo account; the demo password never
 * leaves the server.
 */
export async function signInAsDemo() {
  try {
    await authLib.api.signInEmail({
      body: { email: demoAccount.email, password: demoAccount.password },
      headers: await headers(),
    });
  } catch {
    return { ok: false as const };
  }

  return { ok: true as const };
}
