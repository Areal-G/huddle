import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DatabaseNotEmptyError, seedDatabase } from "./seed/seed-database";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

seedDatabase(prisma)
  .catch((e) => {
    console.error(e instanceof DatabaseNotEmptyError ? e.message : e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
