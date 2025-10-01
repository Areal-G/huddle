import type { EmailChrome } from "../types";

/**
 * Sample branding/env used by the react-email preview server (`pnpm dev`).
 * Real sends build `chrome` from the caller's branding + env via `resolveChrome`.
 */
export const previewChrome: EmailChrome = {
  logoUrl: "http://localhost:3707/images/huddle-logo-mark.png",
  baseUrl: "https://huddle.example",
  domain: "huddle.example",
  supportEmail: "support@example.com",
  appName: "Huddle",
  primaryColor: "#4f46e5",
  hideAttribution: false,
};
