"use client";

import { Button } from "@huddle/ui/button";
import { Icon } from "@huddle/ui/icon";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Trans } from "@/components/trans";

export const SignOutButton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        signOut();
      }}
    >
      <Icon>
        <LogOutIcon />
      </Icon>
      <Trans i18nKey="signOut" defaults="Sign Out" />
    </Button>
  );
};
