"use client";

import { posthog } from "@huddle/posthog/client";
import { buttonVariants } from "@huddle/ui";
import { Icon } from "@huddle/ui/icon";
import { SendIcon } from "lucide-react";
import { Trans } from "@/i18n/client";

export function ContactSupportLink() {
  return (
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
      <Trans i18nKey="contactSupport" defaults="Contact Support" />
    </a>
  );
}
