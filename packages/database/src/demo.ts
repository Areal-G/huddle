import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { demoSnapshot } from "../generated/demo-snapshot";
import type { DemoSnapshot } from "./demo-snapshot";
import { demoExtensions } from "./demo-snapshot";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Moves every date and timestamp forward by whole days, so the sample polls
 * and events keep the same distance from today however old the snapshot is.
 */
async function shiftDates(db: PGlite, days: number) {
  if (days <= 0) return;
  // Whole days in UTC, so all-day events stay on UTC midnight across DST. All
  // of a table's date columns move in one UPDATE, so checks that compare them
  // (an event's end after its start) hold on every row.
  await db.exec(`
    SET TIME ZONE 'UTC';
    DO $$
    DECLARE tbl record;
    BEGIN
      FOR tbl IN
        SELECT c.table_name,
          string_agg(format('%I = %I + interval ''${days} days''', c.column_name, c.column_name), ', ') AS assignments
        FROM information_schema.columns c
        JOIN information_schema.tables t
          ON t.table_schema = c.table_schema AND t.table_name = c.table_name
        WHERE c.table_schema = current_schema()
          AND t.table_type = 'BASE TABLE'
          AND c.is_generated = 'NEVER'
          AND c.data_type IN ('date', 'timestamp without time zone', 'timestamp with time zone')
        GROUP BY c.table_name
      LOOP
        EXECUTE format('UPDATE %I SET %s', tbl.table_name, tbl.assignments);
      END LOOP;
    END $$;
  `);
}

async function loadDemoDatabase(snapshot: DemoSnapshot) {
  const db = new PGlite({
    extensions: demoExtensions,
    loadDataDir: new Blob([Buffer.from(snapshot.data, "base64")]),
  });
  await db.waitReady;
  await shiftDates(db, Math.floor((Date.now() - snapshot.createdAt) / DAY_MS));
  return db;
}

/**
 * Prisma adapter for the portfolio demo: a Postgres (PGlite) that lives in
 * this process's memory. The migrated and seeded database is built once at
 * build time (scripts/build-demo-snapshot.ts); an instance only loads that
 * snapshot, on the first query, and every query waits for it. The seed's ids
 * are deterministic, so a session or link from one instance resolves on
 * another.
 */
export class DemoDatabaseAdapter {
  readonly provider = "postgres";
  readonly adapterName = "pglite-demo";
  #db: Promise<PGlite> | undefined;

  constructor(private readonly snapshot: DemoSnapshot = demoSnapshot) {}

  async connect() {
    this.#db ??= loadDemoDatabase(this.snapshot);
    return new PrismaPGlite(await this.#db).connect();
  }
}
