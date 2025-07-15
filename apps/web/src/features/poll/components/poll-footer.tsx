"use client";
import { posthog } from "@huddle/posthog/client";
import Link from "next/link";
import { useBranding } from "@/features/branding/client";
import { usePoll } from "@/features/poll/client";
import { Trans } from "@/i18n/client";

export function PollFooter() {
  const { hideAttribution } = useBranding();
  const poll = usePoll();

  if (hideAttribution || poll.space?.hideAttribution) {
    return null;
  }

  return (
    <div className="py-6 text-center text-muted-foreground text-sm">
      <Trans
        defaults="Powered by <a>{name}</a>"
        i18nKey="poweredByHuddle"
        values={{ name: "huddle.dev" }}
        components={{
          a: (
            <Link
              prefetch={false}
              className="rounded-none border-b border-b-gray-500 font-semibold hover:text-primary"
              href="https://huddle.dev?utm_source=huddle&utm_medium=poll&utm_campaign=powered_by"
              onClick={() => {
                posthog?.capture("poll_footer:powered_by_link_click", {
                  pollId: poll.id,
                  spaceId: poll.spaceId,
                  tier: poll.space?.tier,
                  $groups: {
                    poll: poll.id,
                    ...(poll.spaceId ? { space: poll.spaceId } : {}),
                  },
                });
              }}
            />
          ),
        }}
      />
    </div>
  );
}
