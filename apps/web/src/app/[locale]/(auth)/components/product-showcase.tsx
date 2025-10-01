import { cn } from "@huddle/ui";
import type { VoteIconType } from "@huddle/ui/vote-icon";
import { VoteIcon } from "@huddle/ui/vote-icon";
import { CalendarCheckIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { Trans } from "react-i18next/TransWithoutContext";
import { OptimizedAvatarImage } from "@/components/optimized-avatar-image";
import { getTranslation } from "@/i18n/server";
import { getLocale } from "@/i18n/server/get-locale";
import { formatDateParts } from "@/lib/datetime/format";

// A fixed illustrative week. The sample never depends on the viewer's clock,
// so it renders identically on the server for everyone.
const SAMPLE_DATES = ["2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"];
const BEST_OPTION = 2;

const SAMPLE_VOTES: { name: string; votes: VoteIconType[] }[] = [
  { name: "Maya Chen", votes: ["yes", "no", "yes", "ifNeedBe"] },
  { name: "Sam Okafor", votes: ["no", "yes", "yes", "yes"] },
  { name: "Lucía Romero", votes: ["yes", "ifNeedBe", "yes", "no"] },
  { name: "Jonas Weber", votes: ["ifNeedBe", "yes", "yes", "no"] },
  { name: "Aiko Tanaka", votes: ["yes", "no", "ifNeedBe", "yes"] },
];

/**
 * The marketing half of the auth pages: a sample poll showing what the
 * product does, with three short benefits. Hidden below the lg breakpoint.
 */
export async function ProductShowcase() {
  const [{ t, i18n }, locale] = await Promise.all([
    getTranslation(),
    getLocale(),
  ]);
  const dates = SAMPLE_DATES.map((value) =>
    formatDateParts(new Date(`${value}T00:00:00Z`), {
      locale,
      timeZone: "UTC",
    }),
  );
  const yesCounts = dates.map(
    (_, index) =>
      SAMPLE_VOTES.filter((row) => row.votes[index] === "yes").length,
  );

  const benefits = [
    {
      icon: <UsersIcon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitGuests"
          defaults="No sign-up for participants"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitGuestsDescription"
          defaults="Anyone with the link can vote in seconds, on any device."
        />
      ),
    },
    {
      icon: <SparklesIcon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitResults"
          defaults="See the best time at a glance"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitResultsDescription"
          defaults="Live results highlight the slot that works for the most people."
        />
      ),
    },
    {
      icon: <CalendarCheckIcon />,
      title: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitSchedule"
          defaults="Book it in one click"
        />
      ),
      description: (
        <Trans
          t={t}
          i18n={i18n}
          ns="app"
          i18nKey="showcaseBenefitScheduleDescription"
          defaults="Pick the winner and everyone gets a calendar invite."
        />
      ),
    },
  ];

  return (
    <div className="relative hidden flex-1 flex-col justify-center overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-indigo-50 via-background to-violet-50 lg:flex lg:p-12 xl:p-16 dark:from-indigo-950/40 dark:via-background dark:to-violet-950/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative z-10 mx-auto w-full max-w-lg space-y-10">
        <div className="space-y-2">
          <h2 className="text-balance font-semibold text-2xl tracking-tight xl:text-3xl">
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="showcaseTitle"
              defaults="Find a time that works for everyone"
            />
          </h2>
          <p className="text-pretty text-muted-foreground">
            <Trans
              t={t}
              i18n={i18n}
              ns="app"
              i18nKey="showcaseDescription"
              defaults="Share a poll, collect votes and settle on the best time without the back-and-forth."
            />
          </p>
        </div>

        <figure
          aria-hidden
          className="rounded-2xl border border-card-border bg-card p-4 shadow-indigo-500/5 shadow-xl ring-1 ring-black/5 dark:ring-white/5"
        >
          <div className="flex items-center justify-between gap-2 pb-3">
            <div>
              <p className="font-medium text-sm">
                <Trans
                  t={t}
                  i18n={i18n}
                  ns="app"
                  i18nKey="showcasePollTitle"
                  defaults="Team offsite planning"
                />
              </p>
              <p className="text-muted-foreground text-xs">
                <Trans
                  t={t}
                  i18n={i18n}
                  ns="app"
                  i18nKey="showcasePollMeta"
                  defaults="{participants} participants · {options} options"
                  values={{
                    participants: SAMPLE_VOTES.length,
                    options: SAMPLE_DATES.length,
                  }}
                />
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-medium text-green-700 text-xs dark:text-green-400">
              <span className="size-1.5 rounded-full bg-green-500" />
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="homePollOpen"
                defaults="Open"
              />
            </span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,3.25rem)] items-center gap-y-1.5">
            <span />
            {dates.map((date, index) => (
              <div
                key={SAMPLE_DATES[index]}
                className={cn(
                  "mx-auto flex w-11 flex-col items-center rounded-lg border py-1 text-center",
                  index === BEST_OPTION
                    ? "border-primary/40 bg-primary/5"
                    : "border-card-border",
                )}
              >
                <span className="text-[10px] text-muted-foreground uppercase">
                  {date.month}
                </span>
                <span className="font-semibold text-sm leading-tight">
                  {date.day}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {date.weekday}
                </span>
              </div>
            ))}
            {SAMPLE_VOTES.map((row) => (
              <div key={row.name} className="contents">
                <div className="flex min-w-0 items-center gap-2 py-1">
                  <OptimizedAvatarImage size="sm" name={row.name} />
                  <span className="truncate text-sm">{row.name}</span>
                </div>
                {row.votes.map((vote, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed sample columns
                    key={index}
                    className={cn(
                      "flex h-8 items-center justify-center",
                      index === BEST_OPTION && "bg-primary/5",
                    )}
                  >
                    <VoteIcon type={vote} />
                  </div>
                ))}
              </div>
            ))}
            <span className="pt-2 text-muted-foreground text-xs">
              <Trans
                t={t}
                i18n={i18n}
                ns="app"
                i18nKey="showcaseYesVotes"
                defaults="Yes votes"
              />
            </span>
            {yesCounts.map((count, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed sample columns
                key={index}
                className="flex justify-center pt-2"
              >
                <span
                  className={cn(
                    "inline-flex min-w-7 justify-center rounded-full px-1.5 py-0.5 font-medium text-xs tabular-nums",
                    index === BEST_OPTION
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-muted-foreground dark:bg-gray-800",
                  )}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </figure>

        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={index}
              className="flex gap-3"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
                {benefit.icon}
              </span>
              <div>
                <p className="font-medium text-sm">{benefit.title}</p>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
