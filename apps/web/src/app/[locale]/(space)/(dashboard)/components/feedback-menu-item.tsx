"use client";

import { usePostHog } from "@huddle/posthog/client";
import { useDialog } from "@huddle/ui/dialog";
import { Icon } from "@huddle/ui/icon";
import { SidebarMenuButton, SidebarMenuItem } from "@huddle/ui/sidebar";
import { MegaphoneIcon } from "lucide-react";
import { Trans } from "@/components/trans";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";

export function FeedbackMenuItem() {
  const dialog = useDialog();
  const posthog = usePostHog();
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          {...dialog.triggerProps}
          onClick={() => {
            posthog?.capture("space_sidebar:feedback_menu_item_click");
            dialog.trigger();
          }}
        >
          <Icon>
            <MegaphoneIcon />
          </Icon>
          <Trans i18nKey="sendFeedback" defaults="Send Feedback" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <FeedbackDialog {...dialog.dialogProps} />
    </>
  );
}
