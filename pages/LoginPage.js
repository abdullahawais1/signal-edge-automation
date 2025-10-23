// pages/LoginPage.js

import { getEnvConfig } from "../constants/constants.js";
import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.env = getEnvConfig();

    // Locators
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.emailField = page.locator("#email");
    this.passwordField = page.locator("#password");
    this.submitButton = page.locator("#btn-login");
    this.dispatchLink = page.locator("//a[@href='/app/obx/dispatch']");
  }

  async navigate() {
    await this.page.goto(`${this.env.BASE_URL}/`);
  }

  async login() {


    await this.loginButton.waitFor({ state: "visible", timeout: 20000 });
    await this.loginButton.click();

    await this.emailField.waitFor({ state: "visible", timeout: 20000 });
    await this.emailField.fill(this.env.EMAIL);
    await expect.soft(this.emailField).toBeVisible();
    await expect.soft(this.emailField).toBeEnabled();

    await this.passwordField.waitFor({ state: "visible", timeout: 20000 });
    await this.passwordField.fill(this.env.PASSWORD);
    await expect.soft(this.passwordField).toBeVisible();
    await expect.soft(this.passwordField).toBeEnabled();

    await this.page.waitForLoadState("networkidle");
    await this.submitButton.waitFor({ state: "visible", timeout: 20000 });
    await this.page.waitForTimeout(1000);
    await this.submitButton.click();

    // Wait for Dashboard
    await this.page.waitForLoadState("networkidle");
    await expect(this.dispatchLink).toBeVisible({ timeout: 30000 });
  }

  async openDispatchModule() {
    await this.dispatchLink.click();
    await this.page.waitForURL("**/app/obx/dispatch", { timeout: 20000 });
    await expect(this.page).toHaveURL(/dispatch/);
  }
}
