import { deleteAllMessages, loginWithEmail } from "@huddle/test-helpers";
import { test } from "@playwright/test";
import { screenshotPath } from "./helpers";

test.beforeAll(async () => {
  await deleteAllMessages();
});

test("dashboard", async ({ page }) => {
  await loginWithEmail(page, { email: "demo@example.com" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: screenshotPath("dashboard"), fullPage: true });
});
