import type { EmailChrome } from "../types";

/**
 * Sample branding/env used by the react-email preview server (`pnpm dev`).
 * Real sends build `chrome` from the caller's branding + env via `resolveChrome`.
 */
export const previewChrome: EmailChrome = {
  logoUrl: "https://d39ixtfgglw55o.cloudfront.net/images/huddle-logo-mark.png",
  baseUrl: "https://huddle.dev",
  domain: "huddle.dev",
  supportEmail: "support@huddle.dev",
  appName: "Huddle",
  primaryColor: "#4f46e5",
  hideAttribution: false,
};
