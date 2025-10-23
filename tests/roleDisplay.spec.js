// tests/roledisplay.spec.js
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Officer Role Display", () => {
  let loginPage;
  let dispatchPage;
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.route(/\.(png|jpg|jpeg)$/i, route => route.abort());
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    // Step 1: Login and open Dispatch module
    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify officer roles and statuses are displayed correctly", async () => {
    // Step 2: Open Assign Dispatch page
    await dispatchPage.openAssignPage();

    // Step 3: Clear statuses before checking roles
    await dispatchPage.clearAllStatuses();

    // Step 4: Verify officer roles and order
    await dispatchPage.verifyOfficerRolesDisplayCorrectly();
  });
});
