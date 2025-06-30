"use client";

import { Button } from "@huddle/ui/button";
import { useDialog } from "@huddle/ui/dialog";

import { Trans } from "@/i18n/client";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function DeleteAccountButton({
  summary,
}: {
  summary?: React.ReactNode;
}) {
  const dialog = useDialog();
  return (
    <>
      <Button className="text-destructive" {...dialog.triggerProps}>
        <Trans i18nKey="deleteAccount" defaults="Delete Account" />
      </Button>
      <DeleteAccountDialog {...dialog.dialogProps} summary={summary} />
    </>
  );
}
