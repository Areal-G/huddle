"use client";

import { buttonVariants } from "@huddle/ui";
import Link from "next/link";
import { Trans } from "@/i18n/client/trans";
import { linkToApp } from "@/lib/linkToApp";

export const LoginButton = () => {
  return (
    <Link
      href={linkToApp("/login")}
      className={buttonVariants({ variant: "ghost" })}
    >
      <Trans i18nKey="login" defaults="Login" />
    </Link>
  );
};
