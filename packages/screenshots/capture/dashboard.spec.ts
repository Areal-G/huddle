import { test } from "@playwright/test";
import { loginWithEmail } from "@huddle/test-helpers";
import { screenshotPath } from "./helpers";

test("dashboard", async ({ page }) => {
  await loginWithEmail(page, { email: "dev+pro@huddle.dev" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: screenshotPath("dashboard"), fullPage: true });
});
