import type { SupportedEmailProviders } from "@huddle/emails";
import { EmailClient } from "@huddle/emails";
import { absoluteUrl } from "@huddle/utils/absolute-url";
import * as Sentry from "@sentry/nextjs";

import { env } from "@/env";
import {
  getAppName,
  getLogoIconUrl,
  getPrimaryColor,
} from "@/features/branding/queries";

export const getEmailClient = (locale?: string) => {
  return new EmailClient({
    provider: {
      name: (process.env.EMAIL_PROVIDER as SupportedEmailProviders) ?? "smtp",
    },
    mail: {
      from: {
        name: env.NOREPLY_EMAIL_NAME,
        address: env.NOREPLY_EMAIL || env.SUPPORT_EMAIL,
      },
    },
    config: {
      logoUrl: getLogoIconUrl(),
      baseUrl: absoluteUrl(),
      domain: absoluteUrl().replace(/(^\w+:|^)\/\//, ""),
      supportEmail: env.SUPPORT_EMAIL,
      primaryColor: getPrimaryColor().light,
      appName: getAppName(),
    },
    locale,
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
    },
  });
};
