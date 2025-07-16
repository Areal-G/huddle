"use client";
import { Button } from "@huddle/ui/button";
import { toast } from "@huddle/ui/sonner";
import { Trans, useTranslation } from "@/i18n/client";
import { useSafeAction } from "@/lib/safe-action/client";
import { cancelAccountDeletionAction } from "../actions";

export function CancelAccountDeletionButton() {
  const { t } = useTranslation();
  const cancelAccountDeletion = useSafeAction(cancelAccountDeletionAction, {
    onSuccess: () => {
      toast.success(
        t("accountDeletionCancelled", {
          defaultValue: "Your account is no longer scheduled for deletion",
        }),
      );
    },
  });

  return (
    <Button
      loading={cancelAccountDeletion.isExecuting}
      onClick={() => cancelAccountDeletion.executeAsync()}
    >
      <Trans i18nKey="cancelAccountDeletion" defaults="Cancel deletion" />
    </Button>
  );
}
