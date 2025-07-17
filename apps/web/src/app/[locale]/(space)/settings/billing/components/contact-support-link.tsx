"use client";

import { posthog } from "@huddle/posthog/client";
import { buttonVariants } from "@huddle/ui";
import { Icon } from "@huddle/ui/icon";
import { SendIcon } from "lucide-react";
import { Trans } from "@/i18n/client";

export function ContactSupportLink() {
  return (
    <div className="flex flex-col items-start gap-3">
      <a
        href="mailto:support@huddle.dev"
        className={buttonVariants()}
        onClick={() => {
          posthog?.capture("space_billing:support_button_click");
        }}
      >
        <Icon>
          <SendIcon />
        </Icon>
        <Trans i18nKey="contactSupport" defaults="Contact support" />
      </a>
      <p className="text-muted-foreground text-sm">
        <Trans
          i18nKey="contactSupportEmail"
          defaults="Or email us at <0>support@huddle.dev</0>"
          components={[
            <a
              key="email"
              href="mailto:support@huddle.dev"
              className="select-all font-medium text-foreground"
            />,
          ]}
        />
      </p>
    </div>
  );
}
