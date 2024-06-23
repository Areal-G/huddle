"use client";

import { Trans } from "@/components/trans";
import { usePostHog } from "@huddle/posthog/client";
import { Button } from "@huddle/ui/button";
import { Icon } from "@huddle/ui/icon";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  const posthog = usePostHog();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        posthog?.reset();
        signOut({
          redirectTo: "/",
        });
      }}
    >
      <Icon>
        <LogOutIcon />
      </Icon>
      <Trans i18nKey="signOut" defaults="Sign Out" />
    </Button>
  );
};
