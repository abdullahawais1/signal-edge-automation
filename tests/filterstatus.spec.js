// tests/filterstatus.spec.js
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { DispatchPage } from "../pages/DispatchPage.js";

test.describe("Signal Dispatch Suite - Filter Status Validation", () => {
  let loginPage;
  let dispatchPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dispatchPage = new DispatchPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.openDispatchModule();
  });

  test("Verify filter statuses dropdown and toggle behavior", async () => {
    await dispatchPage.openAssignPage();
    await dispatchPage.openAllStatusesDropdown();
    await dispatchPage.verifyStatusesVisible();
    await dispatchPage.toggleStatuses();
  });
});
