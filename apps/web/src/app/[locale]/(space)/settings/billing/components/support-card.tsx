"use client";

import { buttonVariants } from "@huddle/ui";
import { SendIcon } from "lucide-react";
import { Trans } from "@/i18n/client";
import {
  PlanCard,
  PlanCardHeading,
  PlanCardHeadingDescription,
  PlanCardHeadingTitle,
} from "./plan-card";

export function SupportCard({
  supportEmail,
  className,
}: {
  supportEmail: string;
  className?: string;
}) {
  return (
    <PlanCard className={className}>
      <PlanCardHeading>
        <PlanCardHeadingTitle>
          <Trans i18nKey="support" defaults="Support" />
        </PlanCardHeadingTitle>
        <PlanCardHeadingDescription>
          <Trans
            i18nKey="supportDescription"
            defaults="Need help with anything?"
          />
        </PlanCardHeadingDescription>
      </PlanCardHeading>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-3 pb-4">
        <a href={`mailto:${supportEmail}`} className={buttonVariants()}>
          <SendIcon className="text-muted-foreground" />
          <Trans i18nKey="contactSupport" defaults="Contact support" />
        </a>
        <p className="text-muted-foreground text-sm">
          <Trans
            i18nKey="contactSupportEmail"
            defaults="Or email us at <0>{email}</0>"
            values={{ email: supportEmail }}
            components={[
              <a
                key="email"
                href={`mailto:${supportEmail}`}
                className="select-all font-medium text-foreground"
              />,
            ]}
          />
        </p>
      </div>
    </PlanCard>
  );
}
