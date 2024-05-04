import { prisma } from "@huddle/database";

export async function getLicense() {
  return prisma.instanceLicense.findFirst();
}
