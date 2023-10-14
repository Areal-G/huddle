import type { SupportedEmailProviders } from "@huddle/emails";
import { EmailClient } from "@huddle/emails";
import { absoluteUrl } from "@huddle/utils/absolute-url";
import * as Sentry from "@sentry/nextjs";

import { env } from "@/env";
import { isSelfHosted } from "@/utils/constants";

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
      logoUrl: isSelfHosted
        ? absoluteUrl("/images/huddle-logo-mark.png")
        : "https://huddle-public.s3.amazonaws.com/images/huddle-logo-mark.png",
      baseUrl: absoluteUrl(),
      domain: absoluteUrl().replace(/(^\w+:|^)\/\//, ""),
      supportEmail: env.SUPPORT_EMAIL,
    },
    locale,
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
    },
  });
};
