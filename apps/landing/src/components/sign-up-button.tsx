"use client";

import { posthog } from "@huddle/posthog/client";
import { buttonVariants } from "@huddle/ui";
import Link from "next/link";
import { Trans } from "@/i18n/client/trans";
import { linkToApp } from "@/lib/linkToApp";

export function SignUpButton() {
  return (
    <Link
      href={linkToApp("/register")}
      className={buttonVariants({ variant: "primary" })}
      onClick={() => {
        posthog.capture("landing:sign_up_button_click");
      }}
    >
      <Trans i18nKey="signUp" defaults="Sign up" />
    </Link>
  );
}
