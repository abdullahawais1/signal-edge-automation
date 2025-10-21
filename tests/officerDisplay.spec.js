import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Officer Display Verification", () => {
  let loginPage;
  let dispatchPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify officers are displayed correctly in all job sections", async () => {
  
    await dispatchPage.openAssignPage();

    await dispatchPage.clearAllStatuses();

    await dispatchPage.verifyOfficersDisplayCorrectly();
  });
});
