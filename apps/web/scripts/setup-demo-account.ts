/**
 * Gives the seeded demo user (packages/database/prisma/seed/data.ts, user-1)
 * a verified email and a password, so the "Try the demo" button on the login
 * page can sign visitors in. Run after `pnpm db:seed`:
 *
 *   pnpm --filter @huddle/web demo:setup
 *
 * Reads DEMO_EMAIL / DEMO_PASSWORD from apps/web/.env (see .env.sample).
 */
import { prisma } from "@huddle/database";
import { hashPassword } from "better-auth/crypto";

const email = process.env.DEMO_EMAIL ?? "demo@example.com";
const password = process.env.DEMO_PASSWORD;

async function main() {
  if (!password || password.length < 8) {
    throw new Error("Set DEMO_PASSWORD (8+ characters) in apps/web/.env");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`No user with email ${email}. Run pnpm db:seed first.`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  const hashed = await hashPassword(password);
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "credential",
        providerAccountId: user.id,
      },
    },
    create: {
      userId: user.id,
      provider: "credential",
      providerAccountId: user.id,
      password: hashed,
    },
    update: { password: hashed },
  });

  console.info(`✓ Demo account ready: ${email}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
