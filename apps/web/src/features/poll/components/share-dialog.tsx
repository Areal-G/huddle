"use client";

import { posthog } from "@huddle/posthog/client";
import { Button } from "@huddle/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useDialog,
} from "@huddle/ui/dialog";
import { Separator } from "@huddle/ui/separator";
import { Share2Icon } from "lucide-react";
import React from "react";
import { useIsFree } from "@/features/billing/client";
import { usePoll } from "@/features/poll/client";
import { InviteByEmail } from "@/features/poll/components/invite-by-email";
import { InviteLinkRow } from "@/features/poll/components/invite-link-row";
import type { PollInviteListItem } from "@/features/poll/invite/types";
import { Trans } from "@/i18n/client";

export function ShareDialog({ invites }: { invites: PollInviteListItem[] }) {
  const poll = usePoll();
  const dialog = useDialog();
  const isFree = useIsFree();
  const isOpen = dialog.dialogProps.open;

  React.useEffect(() => {
    if (!isOpen) return;
    posthog?.capture("poll_share:dialog_open", {
      poll_id: poll.id,
      tier: isFree ? "free" : "pro",
    });
  }, [isOpen, poll.id, isFree]);

  return (
    <>
      <Button variant="primary" {...dialog.triggerProps}>
        <Share2Icon data-icon="inline-start" />
        <span className="sr-only sm:not-sr-only">
          <Trans i18nKey="share" defaults="Share" />
        </span>
      </Button>
      <Dialog {...dialog.dialogProps}>
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
          <InviteLinkRow inviteLink={poll.inviteLink} />
          <Separator />
          <InviteByEmail invites={invites} />
        </DialogContent>
      </Dialog>
    </>
  );
}
