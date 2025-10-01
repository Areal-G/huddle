"use server";

import { cookies, headers } from "next/headers";
import { env } from "@/env";
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
 * Signs the visitor in as the seeded demo account. Only available when
 * DEMO_LOGIN_ENABLED=true; the demo password never leaves the server.
 */
export async function signInAsDemo() {
  if (
    env.DEMO_LOGIN_ENABLED !== "true" ||
    !env.DEMO_EMAIL ||
    !env.DEMO_PASSWORD
  ) {
    return { ok: false as const };
  }

  try {
    await authLib.api.signInEmail({
      body: { email: env.DEMO_EMAIL, password: env.DEMO_PASSWORD },
      headers: await headers(),
    });
  } catch {
    return { ok: false as const };
  }

  return { ok: true as const };
}
