import { PGlite } from "@electric-sql/pglite";
import { citext } from "@electric-sql/pglite/contrib/citext";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { migrations } from "../generated/migrations";
import { PrismaClient } from "../generated/prisma/client";
import { seedDatabase } from "../prisma/seed/seed-database";
import { demoAccount } from "./demo-account";

export const demoExtensions = { citext, pgcrypto };

/** A seeded demo database, saved as a gzipped PGlite data directory. */
export interface DemoSnapshot {
  /** When the snapshot was taken (ms since epoch); dates are shifted from here. */
  createdAt: number;
  /** Base64 of the gzipped data directory. */
  data: string;
}

/**
 * Builds the demo database from every migration and the seed, then dumps it.
 * Runs at build time (scripts/build-demo-snapshot.ts) and in tests, so a
 * serverless instance only has to load the result.
 */
export async function createDemoSnapshot(): Promise<DemoSnapshot> {
  const db = new PGlite({ extensions: demoExtensions });
  for (const migration of migrations) {
    await db.exec(migration);
  }

  const prisma = new PrismaClient({ adapter: new PrismaPGlite(db) });
  await seedDatabase(prisma);
  await prisma.user.update({
    where: { id: demoAccount.userId },
    data: { emailVerified: true },
  });
  await prisma.account.create({
    data: {
      id: "seed-demo-account",
      userId: demoAccount.userId,
      provider: "credential",
      providerAccountId: demoAccount.userId,
      password: await hashPassword(demoAccount.password),
    },
  });
  await prisma.$disconnect();

  const createdAt = Date.now();
  const dump = await db.dumpDataDir("gzip");
  await db.close();
  return {
    createdAt,
    data: Buffer.from(await dump.arrayBuffer()).toString("base64"),
  };
}
