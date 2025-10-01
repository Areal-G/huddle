"use client";

import { buttonVariants } from "@huddle/ui";
import Link from "next/link";
import { Trans } from "@/i18n/client/trans";
import { linkToApp } from "@/lib/linkToApp";
import { useRefSlug } from "@/lib/use-ref-slug";

export const LoginButton = ({ cta = "header_login" }: { cta?: string }) => {
  const ref = useRefSlug();
  return (
    <Link
      href={linkToApp("/login", { ref, cta })}
      className={buttonVariants({ variant: "ghost" })}
    >
      <Trans i18nKey="login" defaults="Login" />
    </Link>
  );
};
