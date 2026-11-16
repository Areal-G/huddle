import { verifyPassword } from "better-auth/crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "../generated/prisma/client";
import { DemoDatabaseAdapter } from "./demo";
import { demoAccount } from "./demo-account";
import type { DemoSnapshot } from "./demo-snapshot";
import { createDemoSnapshot } from "./demo-snapshot";

const DAY_MS = 24 * 60 * 60 * 1000;

let snapshot: DemoSnapshot;
beforeAll(async () => {
  snapshot = await createDemoSnapshot();
});

const createClient = (from: DemoSnapshot = snapshot) =>
  new PrismaClient({ adapter: new DemoDatabaseAdapter(from) });

// Every id and token the seed writes, table by table, in a stable order.
async function snapshotIds(prisma: PrismaClient) {
  const columns = await prisma.$queryRaw<
    Array<{ table_name: string; column_name: string }>
  >`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND column_name IN ('id', 'uid', 'token')
    ORDER BY table_name, column_name`;

  const snapshot: Record<string, unknown[]> = {};
  for (const { table_name, column_name } of columns) {
    const rows = await prisma.$queryRawUnsafe<Array<{ value: unknown }>>(
      `SELECT "${column_name}"::text AS value FROM "${table_name}" ORDER BY 1`,
    );
    snapshot[`${table_name}.${column_name}`] = rows.map((row) => row.value);
  }
  return snapshot;
}

describe("DemoDatabaseAdapter", () => {
  it("loads once and holds every query until the data is in", async () => {
    const prisma = createClient();

    // A cold start: requests race the setup. None may see a half-loaded
    // database or start a second load.
    const results = await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        i % 2 === 0 ? prisma.user.count() : prisma.poll.count(),
      ),
    );

    expect(new Set(results.filter((_, i) => i % 2 === 0))).toEqual(
      new Set([6]),
    );
    expect(new Set(results.filter((_, i) => i % 2 === 1))).toEqual(
      new Set([27]),
    );
  });

  it("gives every instance the same ids and tokens", async () => {
    const [first, second] = await Promise.all([
      snapshotIds(createClient()),
      snapshotIds(createClient()),
    ]);

    expect(Object.keys(first).length).toBeGreaterThan(10);
    expect(first["polls.id"]?.length).toBe(27);
    expect(second).toEqual(first);
  });

  it("lets the demo account sign in with its password", async () => {
    const prisma = createClient();
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: demoAccount.email },
      select: { id: true, emailVerified: true },
    });
    const account = await prisma.account.findFirstOrThrow({
      where: { userId: user.id, provider: "credential" },
      select: { password: true },
    });

    expect(user).toEqual({ id: demoAccount.userId, emailVerified: true });
    expect(
      await verifyPassword({
        hash: account.password ?? "",
        password: demoAccount.password,
      }),
    ).toBe(true);
  });

  it("moves dates forward by the snapshot's age in whole days", async () => {
    const select = {
      select: { id: true, createdAt: true },
      orderBy: { id: "asc" },
    } as const;
    const fresh = await createClient().poll.findMany(select);
    const aged = await createClient({
      ...snapshot,
      createdAt: snapshot.createdAt - 3 * DAY_MS - 1000,
    }).poll.findMany(select);

    expect(aged.map((poll) => poll.id)).toEqual(fresh.map((poll) => poll.id));
    aged.forEach((poll, i) => {
      expect(poll.createdAt.getTime() - fresh[i]!.createdAt.getTime()).toBe(
        3 * DAY_MS,
      );
    });
  });
});
