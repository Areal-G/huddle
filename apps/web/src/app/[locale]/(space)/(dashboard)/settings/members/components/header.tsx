"use client";

import { Button } from "@huddle/ui/button";
import { useDialog } from "@huddle/ui/dialog";
import { Icon } from "@huddle/ui/icon";
import { toast } from "@huddle/ui/sonner";
import { UserPlusIcon } from "lucide-react";
import { Trans } from "@/components/trans";
import { useBilling } from "@/features/billing/client";
import { useSpace } from "@/features/space/client";
import { useTranslation } from "@/i18n/client";
import { InviteMemberDialog } from "./invite-member-dialog";

export function InviteMemberButton() {
  const { t } = useTranslation();
  const inviteMemberDialog = useDialog();
  const space = useSpace();
  const { showPayWall } = useBilling();
  return (
    <>
      <Button
        onClick={() => {
          if (space.getMemberAbility().cannot("create", "SpaceMemberInvite")) {
            toast.error(
              t("adminRoleRequired", {
                defaultValue: "You need to be an admin to perform this action",
              }),
            );
          } else if (space.getAbility().cannot("invite", "Member")) {
            showPayWall();
          } else {
            inviteMemberDialog.trigger();
          }
        }}
      >
        <Icon>
          <UserPlusIcon />
        </Icon>
        <Trans i18nKey="inviteMember" defaults="Invite member" />
      </Button>
      <InviteMemberDialog {...inviteMemberDialog.dialogProps} />
    </>
  );
}
