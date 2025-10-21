// tests/timewindow.spec.js
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Time Window Validation", () => {
  let loginPage;
  let dispatchPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify Time Window dropdown options are displayed correctly", async () => {
    await dispatchPage.openAssignPage();

    await dispatchPage.verifyTimeWindowOptions();
  });
});
