import { prisma } from "@huddle/database";
import dayjs from "dayjs";

export async function seedUsers() {
  console.info("Seeding users...");
  const freeUser = await prisma.user.upsert({
    where: { email: "dev@huddle.dev" },
    update: {},
    create: {
      id: "free-user",
      name: "Dev User",
      email: "dev@huddle.dev",
      timeZone: "America/New_York",
    },
  });

  const proUser = await prisma.user.upsert({
    where: { email: "dev+pro@huddle.dev" },
    update: {},
    create: {
      id: "pro-user",
      name: "Pro User",
      email: "dev+pro@huddle.dev",
      subscription: {
        create: {
          id: "sub_123",
          currency: "usd",
          amount: 700,
          interval: "month",
          status: "active",
          active: true,
          priceId: "price_123",
          periodStart: new Date(),
          periodEnd: dayjs().add(1, "month").toDate(),
        },
      },
    },
  });
  console.info(`✓ Seeded user ${freeUser.email}`);
  console.info(`✓ Seeded user ${proUser.email}`);

  return [freeUser, proUser];
}
