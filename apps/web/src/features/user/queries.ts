import { prisma } from "@huddle/database";

export const getUserCount = async () => {
  return await prisma.user.count();
};
