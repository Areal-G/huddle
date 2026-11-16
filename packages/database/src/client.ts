import { PrismaClient } from "../generated/prisma/client";
import { DemoDatabaseAdapter } from "./demo";

export type * from "../generated/prisma/client";
export { Prisma } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// The portfolio demo has no database server: data lives in this process's
// memory and is seeded on the first query (see ./demo.ts). Next bundles this
// module separately for route handlers and pages, so the client is kept on
// globalThis in every environment: one process, one database.
globalForPrisma.prisma ??= new PrismaClient({
  adapter: new DemoDatabaseAdapter(),
});

export const prisma = globalForPrisma.prisma;

export default prisma;
