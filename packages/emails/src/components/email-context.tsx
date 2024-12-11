import { i18nDefaultConfig, i18nInstance } from "../i18n";
import type { EmailContext } from "../types";

i18nInstance.init({
  ...i18nDefaultConfig,
  initImmediate: true,
});

export const previewEmailContext: EmailContext = {
  logoUrl: "https://d39ixtfgglw55o.cloudfront.net/images/huddle-logo-mark.png",
  baseUrl: "https://huddle.dev",
  domain: "huddle.dev",
  supportEmail: "support@huddle.dev",
  i18n: i18nInstance,
  t: i18nInstance.getFixedT("en"),
  appName: "Huddle",
};
