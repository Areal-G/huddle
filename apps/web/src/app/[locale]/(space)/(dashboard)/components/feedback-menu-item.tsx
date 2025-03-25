"use client";

import { useDialog } from "@huddle/ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@huddle/ui/sidebar";
import { MegaphoneIcon } from "lucide-react";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import { Trans } from "@/i18n/client";

export function FeedbackMenuItem() {
  const dialog = useDialog();
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          {...dialog.triggerProps}
          onClick={() => {
            dialog.trigger();
          }}
        >
          <MegaphoneIcon />
          <Trans i18nKey="sendFeedback" defaults="Send Feedback" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <FeedbackDialog {...dialog.dialogProps} />
    </>
  );
}
