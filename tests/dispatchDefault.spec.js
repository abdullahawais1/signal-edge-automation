// tests/dispatchDefault.spec.js
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Default Status Verification", () => {
  let loginPage;
  let dispatchPage;
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.route(/\.(png|jpg|jpeg)$/i, route => route.abort());
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify default checked statuses in All Statuses dropdown", async () => {
    await dispatchPage.openAssignPage();
    await dispatchPage.verifyDefaultStatuses();
  });
});
