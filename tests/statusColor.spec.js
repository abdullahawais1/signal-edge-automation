// tests/statuscolor.spec.js
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Status Color Verification", () => {
  let loginPage;
  let dispatchPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    // Step 1: Login and open Dispatch module
    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify all status tag colors are correct", async () => {
    
    await dispatchPage.verifyStatusColors();

    await dispatchPage.openAssignPage();

    await dispatchPage.clearAllStatuses();

    await dispatchPage.verifyStatusColors();
  });
});
