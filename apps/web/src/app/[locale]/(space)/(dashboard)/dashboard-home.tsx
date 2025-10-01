import { buttonVariants, cn } from "@huddle/ui";
import { Skeleton } from "@huddle/ui/skeleton";
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BarChart2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  InboxIcon,
  MessageSquareIcon,
  PlusIcon,
  Share2Icon,
} from "lucide-react";
import type React from "react";
import { Suspense } from "react";
import { Trans } from "react-i18next/TransWithoutContext";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import {
  ListView,
  ListViewContent,
  ListViewHeader,
  ListViewTitle,
  ListViewTitleBar,
} from "@/components/list-view";
import { loadOptionalOpenPollUsage } from "@/features/poll/limit/loaders";
import {
  loadPollDashboard,
  loadPollStatusCounts,
  loadSpaceActivity,
} from "@/features/poll/loaders";
import { loadEvents, loadUpcomingEventCount } from "@/features/space/loaders";
import { loadUser, loadUserHasNoAccounts } from "@/features/user/loaders";
import { getTranslation } from "@/i18n/server";
import { isFeatureEnabled } from "@/lib/feature-flags/server";
import {
  HomeActivityFeed,
  HomeEventList,
  HomeGreeting,
  HomePollCard,
} from "./components/home-widgets";
import { PasswordSetupAlert } from "./password-setup-alert";

type T = Awaited<ReturnType<typeof getTranslation>>;

export function DashboardHome() {
  return (
    <ListView>
      <ListViewHeader className="md:hidden">
        <ListViewTitleBar>
          <Suspense>
            <HomeTitle />
          </Suspense>
        </ListViewTitleBar>
      </ListViewHeader>
      <ListViewContent className="px-4 pt-4 pb-10 md:px-8 md:pt-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <Suspense>
            <PasswordAlertGate />
          </Suspense>
          <Suspense fallback={<HeaderSkeleton />}>
            <HomeHeader />
          </Suspense>
          <Suspense fallback={<BodySkeleton />}>
            <HomeBody />
          </Suspense>
        </div>
      </ListViewContent>
    </ListView>
  );
}

async function HomeTitle() {
  const { t, i18n } = await getTranslation();
  return (
    <ListViewTitle>
      <Trans t={t} i18n={i18n} ns="app" i18nKey="home" defaults="Home" />
    </ListViewTitle>
  );
}

async function PasswordAlertGate() {
  const hasNoAccounts = await loadUserHasNoAccounts();
  return hasNoAccounts && isFeatureEnabled("emailLogin") ? (
    <PasswordSetupAlert />
  ) : null;
}

async function HomeHeader() {
  const [user, { t, i18n }] = await Promise.all([loadUser(), getTranslation()]);
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="font-semibold text-2xl tracking-tight md:text-3xl">
          <HomeGreeting name={user.name} />
        </h2>
        <p className="text-muted-foreground text-sm">
          <Trans
            t={t}
            i18n={i18n}
            ns="app"
            i18nKey="homeSubline"
            defaults="Here's how your polls are coming along."
          />
        </p>
      </div>
      <HoverPrefetchLink
        href="/new"
        className={cn(
          buttonVariants({ variant: "primary", size: "lg" }),
          "shadow-sm",
        )}
      >
        <PlusIcon className="size-4" />
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeCreatePoll"
          defaults="Create poll"
        />
      </HoverPrefetchLink>
    </header>
  );
}

async function HomeBody() {
  const [
    { t, i18n },
    dashboard,
    statusCounts,
    openPollUsage,
    upcomingEventCount,
    upcoming,
    activity,
  ] = await Promise.all([
    getTranslation(),
    loadPollDashboard(),
    loadPollStatusCounts(),
    loadOptionalOpenPollUsage(),
    loadUpcomingEventCount(),
    loadEvents({ status: "upcoming", page: 1, pageSize: 5 }),
    loadSpaceActivity(),
  ]);

  const isEmpty =
    statusCounts.open + statusCounts.closed + statusCounts.scheduled === 0 &&
    upcoming.events.length === 0 &&
    activity.length === 0;

  if (isEmpty) {
    return <HomeEmptyState t={t} i18n={i18n} />;
  }

  const responseRate =
    dashboard.invitesSent > 0
      ? Math.round((dashboard.invitesAnswered / dashboard.invitesSent) * 100)
      : null;
  const responseDelta =
    dashboard.responsesThisWeek - dashboard.responsesLastWeek;
  const nextEvent = upcoming.events[0];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard
          icon={<BarChart2Icon />}
          tone="indigo"
          label={
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeStatOpenPolls"
              defaults="Open polls"
            />
          }
          value={statusCounts.open}
          detail={
            openPollUsage?.limit != null ? (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="openPollCountOfLimit"
                defaults="{openCount} of {limit} open"
                values={{
                  openCount: openPollUsage.openCount,
                  limit: openPollUsage.limit,
                }}
              />
            ) : (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeStatNewThisWeek"
                defaults="{count, plural, =0 {None new this week} other {# new this week}}"
                values={{ count: dashboard.pollsCreatedThisWeek }}
              />
            )
          }
          trend={dashboard.pollsCreatedThisWeek > 0 ? "up" : undefined}
        />
        <StatCard
          icon={<CheckCircle2Icon />}
          tone="lime"
          label={
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeStatResponsesThisWeek"
              defaults="Responses this week"
            />
          }
          value={dashboard.responsesThisWeek}
          detail={
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeStatResponsesDelta"
              defaults="{delta} vs last week"
              values={{
                delta:
                  responseDelta > 0 ? `+${responseDelta}` : `${responseDelta}`,
              }}
            />
          }
          trend={
            responseDelta > 0 ? "up" : responseDelta < 0 ? "down" : undefined
          }
        />
        <StatCard
          icon={<CalendarIcon />}
          tone="violet"
          label={
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeStatUpcomingEvents"
              defaults="Upcoming events"
            />
          }
          value={upcomingEventCount}
          detail={
            nextEvent ? (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeStatNextEvent"
                defaults="Next: {title}"
                values={{ title: nextEvent.title }}
              />
            ) : (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeStatNothingScheduled"
                defaults="Nothing scheduled yet"
              />
            )
          }
        />
        <StatCard
          icon={<InboxIcon />}
          tone="sky"
          label={
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeStatResponseRate"
              defaults="Response rate"
            />
          }
          value={responseRate === null ? "–" : `${responseRate}%`}
          detail={
            responseRate === null ? (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeStatNoInvites"
                defaults="No invites sent yet"
              />
            ) : (
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeStatInvitesAnswered"
                defaults="{answered} of {sent} invitees replied"
                values={{
                  answered: dashboard.invitesAnswered,
                  sent: dashboard.invitesSent,
                }}
              />
            )
          }
        />
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <section className="min-w-0 space-y-4 xl:col-span-2">
          <SectionHeader
            title={
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeActivePolls"
                defaults="Active polls"
              />
            }
            href="/polls"
            linkLabel={
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeViewAll"
                defaults="View all"
              />
            }
          />
          {dashboard.polls.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dashboard.polls.map((poll) => (
                <HomePollCard key={poll.id} poll={poll} />
              ))}
            </div>
          ) : (
            <SectionEmpty>
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeNoActivePolls"
                defaults="No open polls right now. Create one to start collecting votes."
              />
            </SectionEmpty>
          )}
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-1 xl:content-start">
          <section className="space-y-4">
            <SectionHeader
              title={
                <Trans
                  t={t}
                  i18n={i18n}
                  ns="app"
                  i18nKey="upcomingEvents"
                  defaults="Upcoming events"
                />
              }
              href="/events"
              linkLabel={
                <Trans
                  t={t}
                  i18n={i18n}
                  ns="app"
                  i18nKey="homeViewAll"
                  defaults="View all"
                />
              }
            />
            <Panel>
              {upcoming.events.length > 0 ? (
                <HomeEventList
                  events={upcoming.events.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    allDay: event.allDay,
                    timeZone: event.timeZone,
                    attendeeCount: event.invites.length,
                  }))}
                />
              ) : (
                <p className="px-4 py-8 text-center text-muted-foreground text-sm">
                  <Trans
                    t={t}
                    i18n={i18n}
                    ns="app"
                    i18nKey="upcomingEventsEmptyStateTitle"
                    defaults="No upcoming events"
                  />
                </p>
              )}
            </Panel>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title={
                <Trans
                  t={t}
                  i18n={i18n}
                  ns="app"
                  i18nKey="homeRecentActivity"
                  defaults="Recent activity"
                />
              }
            />
            <Panel>
              {activity.length > 0 ? (
                <HomeActivityFeed items={activity} />
              ) : (
                <p className="px-4 py-8 text-center text-muted-foreground text-sm">
                  <Trans
                    t={t}
                    i18n={i18n}
                    ns="app"
                    i18nKey="homeNoActivity"
                    defaults="Votes and comments will show up here."
                  />
                </p>
              )}
            </Panel>
          </section>
        </div>
      </div>
    </div>
  );
}

const toneClassName = {
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  lime: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

function StatCard({
  icon,
  tone,
  label,
  value,
  detail,
  trend,
}: {
  icon: React.ReactNode;
  tone: keyof typeof toneClassName;
  label: React.ReactNode;
  value: React.ReactNode;
  detail: React.ReactNode;
  trend?: "up" | "down";
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-4 shadow-2xs transition-shadow duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-muted-foreground text-xs sm:text-sm">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
            toneClassName[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <div className="font-semibold text-2xl tabular-nums tracking-tight md:text-3xl">
        {value}
      </div>
      <div className="flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
        {trend === "up" ? (
          <ArrowUpRightIcon className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />
        ) : trend === "down" ? (
          <ArrowDownRightIcon className="size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
        ) : null}
        <span className="truncate">{detail}</span>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: React.ReactNode;
  href?: string;
  linkLabel?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-semibold text-base tracking-tight">{title}</h2>
      {href ? (
        <HoverPrefetchLink
          href={href}
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          {linkLabel}
          <ArrowRightIcon className="size-3.5" />
        </HoverPrefetchLink>
      ) : null}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xs">
      {children}
    </div>
  );
}

function SectionEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed px-6 py-10 text-center text-muted-foreground text-sm">
      {children}
    </div>
  );
}

function HomeEmptyState({ t, i18n }: Pick<T, "t" | "i18n">) {
  const steps = [
    {
      icon: <PlusIcon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepCreate"
          defaults="Create a poll"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepCreateDescription"
          defaults="Pick a few dates and times that could work."
        />
      ),
    },
    {
      icon: <Share2Icon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepShare"
          defaults="Share the link"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepShareDescription"
          defaults="Everyone votes on the times they can make, no account needed."
        />
      ),
    },
    {
      icon: <MessageSquareIcon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepPick"
          defaults="Pick the best time"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="homeEmptyStepPickDescription"
          defaults="See the winning slot at a glance and send the invite."
        />
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-2xs">
      <div className="relative px-6 py-12 text-center md:px-12 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent"
        />
        <div className="relative mx-auto max-w-lg space-y-3">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm [&_svg]:size-6">
            <CalendarIcon />
          </span>
          <h2 className="font-semibold text-xl tracking-tight md:text-2xl">
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeEmptyTitle"
              defaults="Find a time that works for everyone"
            />
          </h2>
          <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="homeEmptyDescription"
              defaults="Your polls, responses and upcoming events will live here. Start with your first poll; it takes about a minute."
            />
          </p>
          <div className="pt-3">
            <HoverPrefetchLink
              href="/new"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <PlusIcon className="size-4" />
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homeCreateFirstPoll"
                defaults="Create your first poll"
              />
            </HoverPrefetchLink>
          </div>
        </div>
      </div>
      <ol className="grid border-card-border border-t md:grid-cols-3 md:divide-x md:divide-card-border">
        {steps.map((step, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: static steps
            key={index}
            className="flex gap-3 border-card-border border-b p-5 last:border-b-0 md:border-b-0"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4">
              {step.icon}
            </span>
            <div className="space-y-0.5">
              <p className="font-medium text-sm">{step.title}</p>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div aria-hidden className="flex items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
  );
}

function BodySkeleton() {
  return (
    <div aria-hidden className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
