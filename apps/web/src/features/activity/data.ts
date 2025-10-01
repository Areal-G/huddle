import "server-only";

import { prisma } from "@huddle/database";
import type { AuthorizedSpaceId } from "@/lib/tenant-scope";
import { parsePollActivity } from "./schema";

/**
 * Latest activity for a poll, newest first; every row when no limit is
 * given. Rows whose type or payload this
 * version of the vocabulary can't interpret are skipped rather than failing
 * the feed.
 */
export async function listPollActivity({
  pollId,
  spaceId,
  participantId,
  limit,
}: {
  pollId: string;
  spaceId: AuthorizedSpaceId;
  /** Only the events about this response. */
  participantId?: string;
  limit?: number;
}) {
  const rows = await prisma.pollActivity.findMany({
    where: {
      pollId,
      ...(participantId && { participantId }),
      poll: {
        spaceId,
        deleted: false,
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  return rows.flatMap((row) => {
    const event = parsePollActivity(row);
    return event ? [{ id: row.id, createdAt: row.createdAt, event }] : [];
  });
}

const SPACE_FEED_TYPES = [
  "response_created",
  "poll_created",
  "poll_scheduled",
  "poll_closed",
] as const;

export type SpaceActivityItem =
  | {
      kind: "response";
      id: string;
      createdAt: Date;
      poll: { id: string; title: string };
      name: string;
    }
  | {
      kind: "comment";
      id: string;
      createdAt: Date;
      poll: { id: string; title: string };
      name: string;
    }
  | {
      kind: "created" | "scheduled" | "closed";
      id: string;
      createdAt: Date;
      poll: { id: string; title: string };
      name: string | null;
    };

/**
 * The latest responses, comments and poll milestones across the polls a
 * scope can see, newest first, for the home dashboard's activity feed.
 */
export async function listSpaceActivity({
  spaceId,
  createdBy,
  limit,
}: {
  spaceId: AuthorizedSpaceId;
  /** Restricts the feed to polls this user created. */
  createdBy?: string;
  limit: number;
}): Promise<SpaceActivityItem[]> {
  const pollWhere = {
    spaceId,
    deleted: false,
    ...(createdBy && { userId: createdBy }),
  };
  const pollSelect = { select: { id: true, title: true } };

  const [rows, comments] = await Promise.all([
    prisma.pollActivity.findMany({
      where: { type: { in: [...SPACE_FEED_TYPES] }, poll: pollWhere },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      include: { poll: pollSelect },
    }),
    prisma.comment.findMany({
      where: { poll: pollWhere },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      select: { id: true, authorName: true, createdAt: true, poll: pollSelect },
    }),
  ]);

  const actorIds = [
    ...new Set(
      rows.flatMap((row) =>
        row.type !== "response_created" && row.userId ? [row.userId] : [],
      ),
    ),
  ];
  const actors = actorIds.length
    ? await prisma.user.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, name: true },
      })
    : [];
  const actorName = new Map(actors.map((actor) => [actor.id, actor.name]));

  const items: SpaceActivityItem[] = [
    ...comments.map((comment) => ({
      kind: "comment" as const,
      id: comment.id,
      createdAt: comment.createdAt,
      poll: comment.poll,
      name: comment.authorName,
    })),
    ...rows.flatMap((row): SpaceActivityItem[] => {
      const event = parsePollActivity(row);
      if (!event) return [];
      const base = { id: row.id, createdAt: row.createdAt, poll: row.poll };
      switch (event.type) {
        case "response_created":
          return [{ ...base, kind: "response", name: event.payload.name }];
        case "poll_created":
        case "poll_scheduled":
        case "poll_closed":
          return [
            {
              ...base,
              kind:
                event.type === "poll_created"
                  ? "created"
                  : event.type === "poll_scheduled"
                    ? "scheduled"
                    : "closed",
              name: event.userId ? (actorName.get(event.userId) ?? null) : null,
            },
          ];
        default:
          return [];
      }
    }),
  ];

  return items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
