"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useDialog,
} from "@huddle/ui/dialog";
import { Separator } from "@huddle/ui/separator";
import type React from "react";
import { InviteByEmail } from "@/features/poll/components/invite-by-email";
import { InviteLinkRow } from "@/features/poll/components/invite-link-row";
import type { PollStatus } from "@/features/poll/schema";
import { Trans } from "@/i18n/client";

/** Dialog state for SharePollDialog. */
export function useSharePollDialog() {
  const dialog = useDialog();

  const open = () => {
    dialog.trigger();
  };

  return { dialog, open };
}

export function SharePollDialog({
  pollId,
  pollStatus,
  inviteLink,
  ...dialogProps
}: React.ComponentProps<typeof Dialog> & {
  pollId: string;
  pollStatus: PollStatus;
  inviteLink: string;
}) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent size="lg" data-testid="invite-participant-dialog">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="share" defaults="Share" />
          </DialogTitle>
          <DialogDescription>
            <Trans
              i18nKey="shareDialogDescription"
              defaults="Share the invite link, or invite people by email."
            />
          </DialogDescription>
        </DialogHeader>
        <InviteLinkRow inviteLink={inviteLink} />
        <Separator />
        <InviteByEmail pollId={pollId} pollStatus={pollStatus} />
      </DialogContent>
    </Dialog>
  );
}
