import "server-only";

import { prisma } from "@huddle/database";

export async function getComment({ commentId }: { commentId: string }) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: { pollId: true, userId: true },
  });
}
