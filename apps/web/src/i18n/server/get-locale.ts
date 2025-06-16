import { defaultLocale } from "@huddle/languages";
import { headers } from "next/headers";

export async function getLocale() {
  const headersList = await headers();
  const localeFromHeader = headersList.get("x-locale");

  return localeFromHeader ?? defaultLocale;
}
