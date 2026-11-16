// Extra sample content layered on top of data.ts, so the workspace the seed
// owner lands in (Northwind Studio) looks lived in: more polls
// with fuller turnout, finalized and past events, and a sixth member.
// Dates are relative to today (see `d`), so the data never goes stale.
import type { VoteType } from "../../generated/prisma/client";
import type { PollDef, ScheduledEventDef } from "./data";
import {
  polls as basePolls,
  scheduledEvents as baseScheduledEvents,
  spaceMembers as baseSpaceMembers,
  subscriptions as baseSubscriptions,
  users as baseUsers,
} from "./data";

export { eventTypes, spaces } from "./data";

function d(offsetDays: number, hour = 0, minute = 0): string {
  const base = new Date();
  base.setUTCHours(0, 0, 0, 0);
  base.setUTCDate(base.getUTCDate() + offsetDays);
  base.setUTCHours(hour, minute, 0, 0);
  return base.toISOString();
}

// ─── Users and members ───────────────────────────────────────────────────────

export const users = [
  ...baseUsers,
  {
    id: "user-6",
    name: "Priya Raman",
    email: "priya@example.com",
    timeZone: "Asia/Kolkata",
  },
];

export const spaceMembers = [
  ...baseSpaceMembers.map((member) =>
    // The seed owner lands in the team space, not the near-empty personal one.
    member.id === "sm-2"
      ? { ...member, lastSelectedAt: new Date() }
      : member.id === "sm-1"
        ? { ...member, lastSelectedAt: new Date(Date.now() - 86_400_000) }
        : member,
  ),
  {
    id: "sm-7",
    spaceId: "space-2",
    userId: "user-6",
    role: "MEMBER" as const,
  },
];

// Two spare seats, so the members page offers "Invite member".
export const subscriptions = baseSubscriptions.map((sub) => ({
  ...sub,
  quantity: 8,
}));

// ─── Extra polls ─────────────────────────────────────────────────────────────

const Y: VoteType = "yes";
const M: VoteType = "ifNeedBe";
const N: VoteType = "no";

const extraPolls: PollDef[] = [
  {
    title: "Atlas launch review",
    description:
      "Go/no-go review for the Atlas release: QA sign-off, launch checklist, support readiness and the announcement plan.",
    location: "Zoom",
    status: "open",
    timeZone: "America/New_York",
    deadline: d(3, 22),
    userId: "user-1",
    spaceId: "space-2",
    options: [
      { startTime: d(2, 14), duration: 60 },
      { startTime: d(2, 18), duration: 60 },
      { startTime: d(3, 15), duration: 60 },
      { startTime: d(4, 14), duration: 60 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, Y, M] },
      {
        name: "Sarah Chen",
        userId: "user-2",
        email: "sarah@example.com",
        votes: [Y, N, Y, Y],
      },
      {
        name: "Michael Torres",
        userId: "user-3",
        email: "michael@example.com",
        note: "Evening slots are late for London, but I'll make it work if needed.",
        votes: [Y, M, Y, N],
      },
      {
        name: "Emily Nakamura",
        userId: "user-4",
        email: "emily@example.com",
        votes: [M, N, Y, Y],
      },
      {
        name: "James Okonkwo",
        userId: "user-5",
        email: "james@example.com",
        votes: [Y, Y, Y, N],
      },
      {
        name: "Priya Raman",
        userId: "user-6",
        email: "priya@example.com",
        votes: [N, N, Y, Y],
      },
      {
        name: "Diego Alvarez",
        email: "diego.alvarez@example.com",
        votes: [Y, Y, M, N],
      },
      {
        name: "Hannah Becker",
        email: "hannah.becker@example.com",
        votes: [N, Y, Y, M],
      },
      {
        name: "Kwame Mensah",
        email: "kwame.mensah@example.com",
        note: "Support docs will be ready by Wednesday.",
        votes: [Y, N, Y, Y],
      },
      {
        name: "Yuki Tanaka",
        email: "yuki.tanaka@example.com",
        votes: [M, M, Y, N],
      },
    ],
    comments: [
      {
        content:
          "Looks like Wednesday afternoon works for almost everyone. I'll lock it in tomorrow unless someone objects.",
        authorName: "Alex Morgan",
        userId: "user-1",
      },
      {
        content: "Can we add a 10 minute slot for the pricing page changes?",
        authorName: "Sarah Chen",
        userId: "user-2",
      },
      {
        content: "QA sign-off doc is linked in the release channel.",
        authorName: "Hannah Becker",
      },
    ],
  },
  {
    title: "Client kickoff: Brightline Health",
    description:
      "Kickoff with the Brightline team: goals, timeline, points of contact and the first sprint.",
    location: "Brightline office, 12 Finsbury Square, London",
    status: "scheduled",
    timeZone: "Europe/London",
    userId: "user-1",
    spaceId: "space-2",
    scheduledEventId: "event-brightline-kickoff",
    options: [
      { startTime: d(5, 10), duration: 90 },
      { startTime: d(6, 14), duration: 90 },
      { startTime: d(7, 10), duration: 90 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [M, Y, Y] },
      {
        name: "Michael Torres",
        userId: "user-3",
        email: "michael@example.com",
        votes: [Y, Y, N],
      },
      {
        name: "Sarah Chen",
        userId: "user-2",
        email: "sarah@example.com",
        votes: [N, Y, M],
      },
      {
        name: "Grace Okafor",
        email: "grace.okafor@example.com",
        note: "Brightline product lead",
        votes: [Y, Y, N],
      },
      {
        name: "Tom Whitfield",
        email: "tom.whitfield@example.com",
        votes: [N, Y, Y],
      },
      {
        name: "Aisha Rahman",
        email: "aisha.rahman@example.com",
        votes: [M, Y, N],
      },
      {
        name: "Lucas Moreau",
        email: "lucas.moreau@example.com",
        votes: [Y, M, Y],
      },
    ],
    comments: [
      {
        content:
          "Booked for Thursday afternoon. Calendar invites are on their way.",
        authorName: "Alex Morgan",
        userId: "user-1",
      },
      {
        content: "Thanks! We'll bring the compliance requirements doc.",
        authorName: "Grace Okafor",
      },
    ],
  },
  {
    title: "Team game night",
    description:
      "Board games, snacks and a very competitive round of Codenames. Partners welcome.",
    location: "Northwind HQ, 4th floor lounge",
    status: "open",
    userId: "user-1",
    spaceId: "space-2",
    options: [
      { startTime: d(9, 0), duration: 0 },
      { startTime: d(10, 0), duration: 0 },
      { startTime: d(16, 0), duration: 0 },
      { startTime: d(17, 0), duration: 0 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, M, Y] },
      {
        name: "James Okonkwo",
        userId: "user-5",
        email: "james@example.com",
        votes: [Y, N, Y, Y],
      },
      {
        name: "Emily Nakamura",
        userId: "user-4",
        email: "emily@example.com",
        votes: [N, Y, Y, Y],
      },
      {
        name: "Priya Raman",
        userId: "user-6",
        email: "priya@example.com",
        votes: [M, Y, N, Y],
      },
      {
        name: "Sofia Rossi",
        email: "sofia.rossi@example.com",
        votes: [Y, Y, N, Y],
      },
      {
        name: "Ben Carter",
        email: "ben.carter@example.com",
        note: "I'll bring Catan!",
        votes: [Y, M, Y, Y],
      },
      {
        name: "Mei Lin",
        email: "mei.lin@example.com",
        votes: [N, Y, Y, M],
      },
      {
        name: "Omar Haddad",
        email: "omar.haddad@example.com",
        votes: [Y, N, M, Y],
      },
      {
        name: "Chloe Dubois",
        email: "chloe.dubois@example.com",
        votes: [M, Y, Y, Y],
      },
    ],
    comments: [
      {
        content: "Second Friday is looking like the winner so far 🎲",
        authorName: "Ben Carter",
      },
    ],
  },
  {
    title: "Hiring panel: Staff Engineer",
    description:
      "Final-round panel for the Staff Engineer candidate. System design, a values interview and a debrief right after.",
    location: "Google Meet",
    status: "open",
    timeZone: "Asia/Kolkata",
    userId: "user-1",
    spaceId: "space-2",
    options: [
      { startTime: d(3, 9, 30), duration: 90 },
      { startTime: d(4, 9, 30), duration: 90 },
      { startTime: d(5, 13), duration: 90 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, N] },
      {
        name: "Priya Raman",
        userId: "user-6",
        email: "priya@example.com",
        votes: [Y, Y, Y],
      },
      {
        name: "Michael Torres",
        userId: "user-3",
        email: "michael@example.com",
        votes: [N, Y, Y],
      },
      {
        name: "Ravi Patel",
        email: "ravi.patel@example.com",
        votes: [Y, Y, M],
      },
      {
        name: "Fatima Zahra",
        email: "fatima.zahra@example.com",
        votes: [M, Y, N],
      },
      {
        name: "Daniel Kim",
        email: "daniel.kim@example.com",
        votes: [Y, M, Y],
      },
    ],
    comments: [
      {
        content:
          "Scorecards are in the hiring folder. Please submit yours within 24h of the panel.",
        authorName: "Priya Raman",
        userId: "user-6",
      },
    ],
  },
  {
    title: "Q1 planning session",
    description:
      "Two-day planning session to agree on Q1 goals, owners and budget.",
    location: "Lakeside Retreat Center",
    status: "closed",
    closedReason: "manual",
    userId: "user-1",
    spaceId: "space-2",
    options: [
      { startTime: d(-12, 0), duration: 0 },
      { startTime: d(-11, 0), duration: 0 },
      { startTime: d(-5, 0), duration: 0 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, M] },
      {
        name: "Sarah Chen",
        userId: "user-2",
        email: "sarah@example.com",
        votes: [Y, M, N],
      },
      {
        name: "Michael Torres",
        userId: "user-3",
        email: "michael@example.com",
        votes: [N, Y, Y],
      },
      {
        name: "Emily Nakamura",
        userId: "user-4",
        email: "emily@example.com",
        votes: [Y, Y, N],
      },
      {
        name: "James Okonkwo",
        userId: "user-5",
        email: "james@example.com",
        votes: [Y, N, Y],
      },
      {
        name: "Priya Raman",
        userId: "user-6",
        email: "priya@example.com",
        votes: [M, Y, Y],
      },
      {
        name: "Carla Mendez",
        email: "carla.m@northwind.example",
        votes: [Y, Y, N],
      },
      {
        name: "Owen Bradley",
        email: "owen.b@northwind.example",
        votes: [Y, M, M],
      },
    ],
    comments: [
      {
        content:
          "Closing this one: we went with the first weekend. Thanks all!",
        authorName: "Alex Morgan",
        userId: "user-1",
      },
    ],
  },
  {
    title: "Customer advisory board",
    description:
      "Quarterly session with our advisory customers to review the roadmap and gather feedback.",
    location: "Zoom",
    status: "scheduled",
    timeZone: "America/Los_Angeles",
    userId: "user-1",
    spaceId: "space-2",
    scheduledEventId: "event-advisory-board",
    options: [
      { startTime: d(-8, 17), duration: 60 },
      { startTime: d(-6, 17), duration: 60 },
      { startTime: d(-4, 17), duration: 60 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, Y] },
      {
        name: "Sarah Chen",
        userId: "user-2",
        email: "sarah@example.com",
        votes: [N, Y, M],
      },
      {
        name: "Elena Popescu",
        email: "elena.popescu@example.com",
        votes: [Y, Y, N],
      },
      {
        name: "Marcus Lee",
        email: "marcus.lee@example.com",
        votes: [M, Y, Y],
      },
      {
        name: "Nadia Haddad",
        email: "nadia.haddad@example.com",
        votes: [N, Y, Y],
      },
      {
        name: "Javier Ortiz",
        email: "javier.ortiz@example.com",
        votes: [Y, Y, N],
      },
    ],
  },
  {
    title: "Wedding venue visit",
    description:
      "Walk-through of the shortlisted venue with the coordinator. Takes about two hours.",
    location: "Rosewood Gardens, Hudson Valley",
    status: "open",
    userId: "user-1",
    spaceId: "space-1",
    options: [
      { startTime: d(12, 0), duration: 0 },
      { startTime: d(13, 0), duration: 0 },
      { startTime: d(19, 0), duration: 0 },
    ],
    participants: [
      { name: "Alex Morgan", userId: "user-1", votes: [Y, Y, M] },
      { name: "Jordan Lee", email: "jordan.lee@example.com", votes: [Y, N, Y] },
      { name: "Linda Morgan", email: "linda.m@example.com", votes: [M, Y, Y] },
      { name: "Robert Morgan", email: "rob.m@example.com", votes: [Y, Y, N] },
      { name: "Sam Rivera", email: "sam.rivera@example.com", votes: [Y, M, Y] },
    ],
    comments: [
      {
        content:
          "The coordinator said Saturdays book up fast, so let's decide soon!",
        authorName: "Jordan Lee",
      },
    ],
  },
];

// ─── Fuller turnout on the smaller team polls ────────────────────────────────

const extraVoters = [
  { name: "Isabella Garcia", email: "isabella.garcia@example.com" },
  { name: "Noah Fischer", email: "noah.fischer@example.com" },
  { name: "Amara Nwosu", email: "amara.nwosu@example.com" },
  { name: "Lars Johansson", email: "lars.johansson@example.com" },
  { name: "Ana Silva", email: "ana.silva@example.com" },
];

// Extra voters back the option already in the lead, so every poll keeps a
// clear winner, and spread the rest of their votes deterministically.
function padParticipants(poll: PollDef, index: number): PollDef {
  if (poll.spaceId !== "space-2" || poll.participants.length >= 6) {
    return poll;
  }
  const scores = poll.options.map((_, i) =>
    poll.participants.reduce(
      (sum, p) =>
        sum + (p.votes[i] === "yes" ? 2 : p.votes[i] === "ifNeedBe" ? 1 : 0),
      0,
    ),
  );
  const best = scores.indexOf(Math.max(...scores));
  const needed = 7 - poll.participants.length;
  const added = extraVoters.slice(0, needed).map((voter, v) => ({
    ...voter,
    votes: poll.options.map((_, i): VoteType => {
      if (i === best) return "yes";
      const pick = (i + v + index) % 3;
      return pick === 0 ? "yes" : pick === 1 ? "ifNeedBe" : "no";
    }),
  }));
  return { ...poll, participants: [...poll.participants, ...added] };
}

export const polls: PollDef[] = [
  ...basePolls.map(padParticipants),
  ...extraPolls,
];

// ─── Extra events ────────────────────────────────────────────────────────────

const extraEvents: ScheduledEventDef[] = [
  {
    id: "event-brightline-kickoff",
    title: "Client kickoff: Brightline Health",
    description:
      "Kickoff with the Brightline team: goals, timeline, points of contact and the first sprint.",
    location: {
      provider: "custom",
      address: "Brightline office, 12 Finsbury Square, London",
    },
    status: "confirmed",
    timeZone: "Europe/London",
    start: d(6, 14),
    end: d(6, 15, 30),
    allDay: false,
    userId: "user-1",
    spaceId: "space-2",
    invites: [
      {
        inviteeName: "Michael Torres",
        inviteeEmail: "michael@example.com",
        inviteeId: "user-3",
        inviteeTimeZone: "Europe/London",
        status: "accepted",
      },
      {
        inviteeName: "Sarah Chen",
        inviteeEmail: "sarah@example.com",
        inviteeId: "user-2",
        inviteeTimeZone: "America/Los_Angeles",
        status: "tentative",
      },
      {
        inviteeName: "Grace Okafor",
        inviteeEmail: "grace.okafor@example.com",
        status: "accepted",
      },
      {
        inviteeName: "Tom Whitfield",
        inviteeEmail: "tom.whitfield@example.com",
        status: "accepted",
      },
      {
        inviteeName: "Aisha Rahman",
        inviteeEmail: "aisha.rahman@example.com",
        status: "pending",
      },
    ],
  },
  {
    id: "event-advisory-board",
    title: "Customer advisory board",
    description:
      "Quarterly session with our advisory customers to review the roadmap and gather feedback.",
    location: { provider: "custom", address: "Zoom" },
    status: "confirmed",
    timeZone: "America/Los_Angeles",
    start: d(-6, 17),
    end: d(-6, 18),
    allDay: false,
    userId: "user-1",
    spaceId: "space-2",
    invites: [
      {
        inviteeName: "Sarah Chen",
        inviteeEmail: "sarah@example.com",
        inviteeId: "user-2",
        inviteeTimeZone: "America/Los_Angeles",
        status: "accepted",
      },
      {
        inviteeName: "Elena Popescu",
        inviteeEmail: "elena.popescu@example.com",
        status: "accepted",
      },
      {
        inviteeName: "Marcus Lee",
        inviteeEmail: "marcus.lee@example.com",
        status: "accepted",
      },
      {
        inviteeName: "Nadia Haddad",
        inviteeEmail: "nadia.haddad@example.com",
        status: "declined",
      },
    ],
  },
  {
    title: "Volunteer day: riverside cleanup",
    description: "Company volunteer day. Gloves and lunch provided.",
    location: { provider: "custom", address: "Riverside Park, north entrance" },
    status: "confirmed",
    start: d(20, 0),
    end: d(21, 0),
    allDay: true,
    userId: "user-1",
    spaceId: "space-2",
    invites: [
      {
        inviteeName: "James Okonkwo",
        inviteeEmail: "james@example.com",
        inviteeId: "user-5",
        status: "accepted",
      },
      {
        inviteeName: "Priya Raman",
        inviteeEmail: "priya@example.com",
        inviteeId: "user-6",
        status: "accepted",
      },
      {
        inviteeName: "Emily Nakamura",
        inviteeEmail: "emily@example.com",
        inviteeId: "user-4",
        status: "tentative",
      },
    ],
  },
];

export const scheduledEvents: ScheduledEventDef[] = [
  ...baseScheduledEvents,
  ...extraEvents,
];
