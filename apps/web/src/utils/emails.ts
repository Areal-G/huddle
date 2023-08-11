import { EmailClient, SupportedEmailProviders } from "@huddle/emails";

import { env } from "@/env";
import { absoluteUrl } from "@/utils/absolute-url";
import { isSelfHosted } from "@/utils/constants";

export const emailClient = new EmailClient({
  openPreviews: env.NODE_ENV === "development",
  provider: {
    name: (process.env.EMAIL_PROVIDER as SupportedEmailProviders) ?? "smtp",
  },
  mail: {
    from: {
      name: env.NOREPLY_EMAIL_NAME,
      address: env.NOREPLY_EMAIL || env.SUPPORT_EMAIL,
    },
  },
  context: {
    logoUrl: isSelfHosted
      ? absoluteUrl("/images/huddle-logo-mark.png")
      : "https://huddle-public.s3.amazonaws.com/images/huddle-logo-mark.png",
    baseUrl: absoluteUrl(""),
    domain: absoluteUrl("").replace(/(^\w+:|^)\/\//, ""),
    supportEmail: env.SUPPORT_EMAIL,
  },
});
