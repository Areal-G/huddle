"use client";
import Link from "next/link";
import { useBranding } from "@/features/branding/client";
import { Trans } from "@/i18n/client";

export function PollFooter() {
  const { hideAttribution } = useBranding();

  if (hideAttribution) {
    return null;
  }

  return (
    <div className="pt-4 pb-12 text-center text-muted-foreground text-sm">
      <Trans
        defaults="Powered by <a>{name}</a>"
        i18nKey="poweredByHuddle"
        values={{ name: "huddle.dev" }}
        components={{
          a: (
            <Link
              className="rounded-none border-b border-b-gray-500 font-semibold hover:text-primary"
              href="https://huddle.dev"
            />
          ),
        }}
      />
    </div>
  );
}
