import "server-only";
import { prisma } from "@huddle/database";
import { createLogger } from "@huddle/logger";
import { effectiveSpaceMemberWhere } from "@/features/space/member/utils";
import * as errorReporting from "@/lib/error-reporting";

const logger = createLogger("auth/merge-user");

const getActiveSpaceForUser = async ({ userId }: { userId: string }) => {
  const spaceMember = await prisma.spaceMember.findFirst({
    where: effectiveSpaceMemberWhere({ userId }),
    select: {
      spaceId: true,
    },
    orderBy: {
      lastSelectedAt: "desc",
    },
  });

  return spaceMember?.spaceId;
};

export const linkAnonymousUser = async (
  authenticatedUserId: string,
  anonymousUserId: string,
) => {
  let spaceId: string | undefined;

  try {
    // Claim event registrations made with the account's own email. A
    // registration's email is its identity (the host's record), so it must
    // not be reassigned to an account that doesn't control that address —
    // only the ones whose email matches follow the user. This is scoped
    // independently of the space because a freshly created account may not
    // have its space provisioned yet.
    const authenticatedUser = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: { email: true },
    });

    spaceId = await getActiveSpaceForUser({
      userId: authenticatedUserId,
    });

    if (!spaceId) {
      // Reached when the guest links into a brand-new account that hasn't
      // been through /setup yet (setup creates the space and adopts these
      // orphaned polls), or when the user's only memberships are
      // ineffective (non-owner rows in hobby spaces). Transfer ownership
      // anyway — the anonymous user is deleted once this returns merged
      // and polls cascade with it — and leave spaceId null.
      logger.info(
        { userId: authenticatedUserId },
        "User has no effective space; migrating guest content without a space",
      );
    }

    // A batch, not an interactive transaction: the interactive form's 5s
    // timeout rolled back merges whose commit landed late, and the guest was
    // then deleted with everything still on it.
    await prisma.$transaction([
      ...(authenticatedUser?.email
        ? [
            prisma.scheduledEventInvite.updateMany({
              where: {
                inviteeId: anonymousUserId,
                inviteeEmail: authenticatedUser.email,
              },
              data: {
                inviteeId: authenticatedUserId,
              },
            }),
          ]
        : []),

      // Transfer polls
      prisma.poll.updateMany({
        where: {
          userId: anonymousUserId,
        },
        data: {
          userId: authenticatedUserId,
          ...(spaceId ? { spaceId } : {}),
        },
      }),

      // Transfer participants
      prisma.participant.updateMany({
        where: {
          userId: anonymousUserId,
        },
        data: {
          userId: authenticatedUserId,
        },
      }),

      // Transfer comments
      prisma.comment.updateMany({
        where: {
          userId: anonymousUserId,
        },
        data: {
          userId: authenticatedUserId,
        },
      }),

      // Transfer poll activity actor refs. They are soft references (no
      // FK), so nothing else migrates them; without this the guest's
      // events would point at the anonymous user forever, which is
      // deleted after linking. Account deletion leaves refs inert on
      // purpose — linking is the opposite case: the person still exists.
      prisma.pollActivity.updateMany({
        where: {
          userId: anonymousUserId,
        },
        data: {
          userId: authenticatedUserId,
        },
      }),
    ]);
  } catch (error) {
    errorReporting.captureException(error);
    return { merged: false };
  }

  return { merged: true };
};
