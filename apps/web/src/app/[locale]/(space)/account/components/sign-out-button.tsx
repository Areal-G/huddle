"use client";

import { Trans } from "@/components/trans";
import { usePostHog } from "@huddle/posthog/client";
import { Button } from "@huddle/ui/button";
import { Icon } from "@huddle/ui/icon";
import Cookies from "js-cookie";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { POSTHOG_BOOTSTAP_DATA_COOKIE_NAME } from "node_modules/@huddle/posthog/src/constants";

export const SignOutButton = () => {
  const posthog = usePostHog();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        posthog?.reset();
        Cookies.remove(POSTHOG_BOOTSTAP_DATA_COOKIE_NAME);
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
