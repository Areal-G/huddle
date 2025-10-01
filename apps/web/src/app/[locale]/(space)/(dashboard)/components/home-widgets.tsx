"use client";

import { cn } from "@huddle/ui";
import {
  CalendarCheckIcon,
  CircleStopIcon,
  MessageCircleIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import type * as React from "react";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import { OptimizedAvatarImage } from "@/components/optimized-avatar-image";
import {
  EventCalendarCard,
  EventTimeRange,
} from "@/features/scheduled-event/components/event-date-time";
import { Trans } from "@/i18n/client";
import { CalendarDate } from "@/lib/datetime/calendar-date";
import { useDateTimeConfig } from "@/lib/datetime/client";
import { RelativeTime } from "@/lib/datetime/relative-time";
import { Time } from "@/lib/datetime/time";
import type { DateInput } from "@/lib/datetime/types";
import { useHydrated } from "@/lib/datetime/use-hydrated";
import { instantToWallTime } from "@/lib/datetime/wall-time";

type PartOfDay = "morning" | "afternoon" | "evening";

function usePartOfDay(): PartOfDay | null {
  const hydrated = useHydrated();
  const { timeZone } = useDateTimeConfig();
  if (!hydrated) return null;
  // The viewer's clock decides the greeting, so it is only read on the client
  const now = new Date();
  const hour = timeZone
    ? Number(instantToWallTime(now, timeZone).slice(11, 13))
    : now.getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function HomeGreeting({ name }: { name: string }) {
  const partOfDay = usePartOfDay();
  const firstName = name.trim().split(/\s+/)[0] ?? name;

  switch (partOfDay) {
    case "morning":
      return (
        <Trans
          i18nKey="homeGreetingMorning"
          defaults="Good morning, {name}"
          values={{ name: firstName }}
        />
      );
    case "afternoon":
      return (
        <Trans
          i18nKey="homeGreetingAfternoon"
          defaults="Good afternoon, {name}"
          values={{ name: firstName }}
        />
      );
    case "evening":
      return (
        <Trans
          i18nKey="homeGreetingEvening"
          defaults="Good evening, {name}"
          values={{ name: firstName }}
        />
      );
    default:
      return (
        <Trans
          i18nKey="homeGreeting"
          defaults="Welcome back, {name}"
          values={{ name: firstName }}
        />
      );
  }
}

/** Date and time of a poll option; zero duration means an all-day date. */
function OptionDateTime({
  start,
  duration,
  timeZone,
}: {
  start: DateInput;
  duration: number;
  timeZone: string | null;
}) {
  if (duration === 0) {
    return (
      <span className="flex items-baseline gap-1.5">
        <CalendarDate value={start} preset="weekdayMonthDayShort" />
        <span className="text-muted-foreground">
          <Trans i18nKey="allDay" defaults="All day" />
        </span>
      </span>
    );
  }
  // Floating times are stored as UTC wall time and shown as-is
  const displayTimeZone = timeZone === null ? "UTC" : undefined;
  return (
    <span className="flex items-baseline gap-1.5">
      <Time
        value={start}
        preset="weekdayMonthDayShort"
        timeZone={displayTimeZone}
      />
      <Time
        value={start}
        preset="time"
        timeZone={displayTimeZone}
        className="text-muted-foreground"
      />
    </span>
  );
}

function VoteBar({
  yes,
  ifNeedBe,
  no,
  total,
}: {
  yes: number;
  ifNeedBe: number;
  no: number;
  total: number;
}) {
  const pct = (value: number) => `${total > 0 ? (value / total) * 100 : 0}%`;
  return (
    <div className="space-y-1.5">
      <div
        aria-hidden
        className="flex h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
      >
        <div className="bg-green-500" style={{ width: pct(yes) }} />
        <div className="bg-amber-400" style={{ width: pct(ifNeedBe) }} />
        <div
          className="bg-gray-300 dark:bg-gray-600"
          style={{ width: pct(no) }}
        />
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-xs tabular-nums">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-green-500" />
          <Trans
            i18nKey="homeVoteYesCount"
            defaults="{count} yes"
            values={{ count: yes }}
          />
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-amber-400" />
          <Trans
            i18nKey="homeVoteIfNeedBeCount"
            defaults="{count} if need be"
            values={{ count: ifNeedBe }}
          />
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          <Trans
            i18nKey="homeVoteNoCount"
            defaults="{count} no"
            values={{ count: no }}
          />
        </span>
      </div>
    </div>
  );
}

function AvatarStack({
  people,
  total,
}: {
  people: { id: string; name: string; image: string | null }[];
  total: number;
}) {
  const extra = total - people.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {people.map((person) => (
        <OptimizedAvatarImage
          key={person.id}
          size="sm"
          name={person.name}
          src={person.image ?? undefined}
          className="ring-2 ring-card"
        />
      ))}
      {extra > 0 ? (
        <span className="relative inline-flex size-6 items-center justify-center rounded-full bg-gray-100 font-medium text-[10px] text-muted-foreground ring-2 ring-card dark:bg-gray-800">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

export type HomePoll = {
  id: string;
  title: string;
  createdAt: Date;
  deadline: Date | null;
  timeZone: string | null;
  optionCount: number;
  participantCount: number;
  participants: { id: string; name: string; image: string | null }[];
  leadingOption: {
    start: Date;
    duration: number;
    yes: number;
    ifNeedBe: number;
    no: number;
  } | null;
};

export function HomePollCard({ poll }: { poll: HomePoll }) {
  return (
    <HoverPrefetchLink
      href={`/poll/${poll.id}`}
      className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-card-border bg-card p-4 shadow-2xs transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-sm group-hover:text-primary">
            {poll.title}
          </h3>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {poll.deadline ? (
              <Trans
                i18nKey="homePollClosesIn"
                defaults="Closes <time />"
                components={{ time: <RelativeTime value={poll.deadline} /> }}
              />
            ) : (
              <Trans
                i18nKey="homePollCreated"
                defaults="Created <time />"
                components={{ time: <RelativeTime value={poll.createdAt} /> }}
              />
            )}
            <span aria-hidden> · </span>
            <Trans
              i18nKey="optionCount"
              defaults="{count, plural, one {# option} other {# options}}"
              values={{ count: poll.optionCount }}
            />
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-medium text-green-700 text-xs dark:text-green-400">
          <span className="size-1.5 rounded-full bg-green-500" />
          <Trans i18nKey="homePollOpen" defaults="Open" />
        </span>
      </div>

      {poll.leadingOption ? (
        <div className="space-y-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/40">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-muted-foreground text-xs">
              <Trans i18nKey="homePollLeading" defaults="Leading option" />
            </span>
            <span className="truncate font-medium text-xs">
              <OptionDateTime
                start={poll.leadingOption.start}
                duration={poll.leadingOption.duration}
                timeZone={poll.timeZone}
              />
            </span>
          </div>
          <VoteBar
            yes={poll.leadingOption.yes}
            ifNeedBe={poll.leadingOption.ifNeedBe}
            no={poll.leadingOption.no}
            total={poll.participantCount}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-3 text-center text-muted-foreground text-xs">
          <Trans
            i18nKey="homePollNoVotes"
            defaults="No votes yet. Share the link to get responses."
          />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        {poll.participantCount > 0 ? (
          <AvatarStack
            people={poll.participants}
            total={poll.participantCount}
          />
        ) : (
          <span />
        )}
        <span className="text-muted-foreground text-xs tabular-nums">
          <Trans
            i18nKey="homePollResponseCount"
            defaults="{count, plural, =0 {No responses} one {1 response} other {# responses}}"
            values={{ count: poll.participantCount }}
          />
        </span>
      </div>
    </HoverPrefetchLink>
  );
}

export type HomeEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  timeZone: string | null;
  attendeeCount: number;
};

export function HomeEventList({ events }: { events: HomeEvent[] }) {
  return (
    <ul className="divide-y divide-card-border">
      {events.map((event) => (
        <li key={event.id}>
          <HoverPrefetchLink
            href={`/e/${event.id}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <EventCalendarCard
              start={event.start}
              allDay={event.allDay}
              timeZone={event.timeZone}
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{event.title}</p>
              <p className="truncate text-muted-foreground text-xs">
                <EventTimeRange
                  start={event.start}
                  end={event.end}
                  allDay={event.allDay}
                  timeZone={event.timeZone}
                />
              </p>
            </div>
            {event.attendeeCount > 0 ? (
              <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                <Trans
                  i18nKey="attendeeCount"
                  defaults="{count, plural, =0 {No attendees} one {1 attendee} other {# attendees}}"
                  values={{ count: event.attendeeCount }}
                />
              </span>
            ) : null}
          </HoverPrefetchLink>
        </li>
      ))}
    </ul>
  );
}

export type HomeActivityItem = {
  kind: "response" | "comment" | "created" | "scheduled" | "closed";
  id: string;
  createdAt: Date;
  poll: { id: string; title: string };
  name: string | null;
};

const activityStyle: Record<
  HomeActivityItem["kind"],
  { icon: React.ElementType; className: string }
> = {
  response: {
    icon: UserPlusIcon,
    className: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
  },
  comment: {
    icon: MessageCircleIcon,
    className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  created: {
    icon: PlusIcon,
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  scheduled: {
    icon: CalendarCheckIcon,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  closed: {
    icon: CircleStopIcon,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

function ActivitySentence({ item }: { item: HomeActivityItem }) {
  const name = item.name ?? "";
  const components = {
    b: <span className="font-medium text-foreground" />,
  };
  const values = { name, title: item.poll.title };
  switch (item.kind) {
    case "response":
      return (
        <Trans
          i18nKey="homeActivityResponse"
          defaults="<b>{name}</b> voted on <b>{title}</b>"
          values={values}
          components={components}
        />
      );
    case "comment":
      return (
        <Trans
          i18nKey="homeActivityComment"
          defaults="<b>{name}</b> commented on <b>{title}</b>"
          values={values}
          components={components}
        />
      );
    case "scheduled":
      return item.name ? (
        <Trans
          i18nKey="homeActivityScheduled"
          defaults="<b>{name}</b> scheduled <b>{title}</b>"
          values={values}
          components={components}
        />
      ) : (
        <Trans
          i18nKey="homeActivityScheduledAnonymous"
          defaults="<b>{title}</b> was scheduled"
          values={values}
          components={components}
        />
      );
    case "created":
      return item.name ? (
        <Trans
          i18nKey="homeActivityCreated"
          defaults="<b>{name}</b> created <b>{title}</b>"
          values={values}
          components={components}
        />
      ) : (
        <Trans
          i18nKey="homeActivityCreatedAnonymous"
          defaults="<b>{title}</b> was created"
          values={values}
          components={components}
        />
      );
    case "closed":
      return (
        <Trans
          i18nKey="homeActivityClosed"
          defaults="<b>{title}</b> was closed"
          values={values}
          components={components}
        />
      );
  }
}

export function HomeActivityFeed({ items }: { items: HomeActivityItem[] }) {
  return (
    <ol className="relative space-y-4 px-4 py-4">
      {items.map((item, index) => {
        const style = activityStyle[item.kind];
        const Icon = style.icon;
        return (
          <li key={`${item.kind}-${item.id}`} className="relative flex gap-3">
            {index < items.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-8 bottom-[-12px] left-3.5 w-px bg-card-border"
              />
            ) : null}
            <span
              className={cn(
                "relative inline-flex size-7 shrink-0 items-center justify-center rounded-full",
                style.className,
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <HoverPrefetchLink
                href={`/poll/${item.poll.id}`}
                className="line-clamp-2 text-muted-foreground text-sm hover:text-foreground"
              >
                <ActivitySentence item={item} />
              </HoverPrefetchLink>
              <RelativeTime
                value={item.createdAt}
                className="text-muted-foreground/80 text-xs"
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
