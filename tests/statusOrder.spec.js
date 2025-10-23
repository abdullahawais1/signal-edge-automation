// tests/statusorder.spec.js
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Job Status Order Verification", () => {
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

  test("Verify job status order in Dedicated and Patrol sections", async () => {
   
    await dispatchPage.openAssignPage();

    await dispatchPage.clearAllStatuses();

    await dispatchPage.verifyJobStatusOrder();
  });
});
