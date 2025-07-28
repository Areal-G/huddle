"use cache";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { getTranslation } from "@/i18n/server";
import { HomePage } from "./home-page";

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  cacheLife("days");
  const { locale } = await props.params;
  return <HomePage locale={locale} />;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  cacheLife("max");
  const { locale } = await props.params;
  const { t } = await getTranslation(locale, "home");
  return {
    title: t("metaTitle", {
      defaultValue: "Huddle: Free Group Meeting Scheduling Tool",
      ns: "home",
    }),
    description: t("metaDescription", {
      ns: "home",
      defaultValue:
        "Huddle is the fastest and easiest scheduling and collaboration tool. Create a meeting poll in seconds, no login required.",
    }),
  };
}
