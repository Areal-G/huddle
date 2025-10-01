"use client";

import { Button } from "@huddle/ui/button";
import { mutationOptions } from "@next-safe-action/adapter-tanstack-query";
import { useMutation } from "@tanstack/react-query";
import { Trans } from "@/i18n/client";
import { makeMeAdminAction } from "./actions";

export function MakeMeAdminButton() {
  const makeMeAdmin = useMutation(mutationOptions(makeMeAdminAction));
  return (
    <Button
      onClick={() => makeMeAdmin.mutate()}
      loading={makeMeAdmin.isPending}
      variant="primary"
    >
      <Trans i18nKey="adminSetupCta" defaults="Make me an admin" />
    </Button>
  );
}
