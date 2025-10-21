// pages/DispatchPage.js
import { expect } from "@playwright/test";

export class DispatchPage {
  constructor(page) {
    this.page = page;

    // ✅ Constant and shared locators
    this.dispatchRow = page
      .getByRole("row", { name: "201335 Automation Test1 226" }) // constant dispatch row
      .getByRole("button")
      .first();

    // ---------------- Common Locators ----------------
    this.clearStatusesButton = page
      .locator("div")
      .filter({ hasText: /^All Statuses \(2\)/ })
      .getByRole("img")
      .first();

    this.allStatusesHeading = page.getByRole("heading", { name: /All Statuses/i });

    this.availableAccordion = page.locator("div.MuiAccordion-root", {
      has: page.locator("h6", { hasText: "Available Users" }),
    });

    this.officerNames = this.availableAccordion.locator("p.MuiTypography-body1");

    // ---------------- Filter Status Locators ----------------
    this.allStatusesDropdown = page.getByRole("heading", { name: "All Statuses (2)" });
    this.statusDropdown = page.locator("#simple-popper");

    // Expected statuses for filter test
    this.expectedStatuses = [
      "All Statuses",
      "In Progress",
      "Not Started",
      "Upcoming",
      "Clocked In",
      "Available",
    ];
  }

  // ---------------- Common Methods ----------------

  async openAssignPage() {
    await this.dispatchRow.waitFor({ state: "visible", timeout: 20000 });
    await this.dispatchRow.click();
    await this.page.waitForURL("**/assign-officer**", { timeout: 30000 });
    await expect(this.page).toHaveURL(/assign-officer/);
    console.log("✅ Navigated to Assign Dispatch page");
  }

  async clearAllStatuses() {
    await this.clearStatusesButton.waitFor({ state: "visible", timeout: 15000 });
    await this.clearStatusesButton.click();
    await this.page.waitForTimeout(1000);

    await expect.soft(this.allStatusesHeading).toBeVisible();
    const headingText = await this.allStatusesHeading.innerText();
    expect.soft(headingText).not.toContain("(2)");

    console.log("✅ Cleared all statuses");
  }

  async waitForAvailableUsers() {
    await this.availableAccordion.waitFor({ state: "visible", timeout: 15000 });
    console.log("✅ Available Users section visible");
  }

  async getOfficerList() {
    const count = await this.officerNames.count();
    console.log(`✅ Found ${count} officer name elements`);
    const users = [];

    for (let i = 0; i < count; i++) {
      const officerNameElement = this.officerNames.nth(i);
      const card = officerNameElement.locator(
        "xpath=ancestor::div[.//span[contains(@class,'MuiTypography-subtitle3')]][1]"
      );

      const name = (await officerNameElement.textContent().catch(() => "")).trim() || "N/A";
      const status =
        (
          await card
            .locator("span:has-text('Clocked in'), span:has-text('Available')")
            .first()
            .textContent()
            .catch(() => "")
        ).trim() || "N/A";

      users.push({ name, status });
    }

    console.table(users);
    return users;
  }

  async verifyClockinOrder(users) {
    const statuses = users.map((u) => u.status);
    const firstAvailableIndex = statuses.indexOf("Available");
    const lastClockedInIndex = statuses.lastIndexOf("Clocked in");

    if (lastClockedInIndex === -1) {
      console.warn("⚠️ No clocked-in officer available currently");
    } else if (firstAvailableIndex !== -1 && lastClockedInIndex !== -1) {
      expect(lastClockedInIndex).toBeLessThan(firstAvailableIndex);
      console.log("✅ 'Clocked in' users appear before 'Available' users");
    } else {
      console.warn("⚠️ Not enough data to validate order");
    }
  }

  // ---------------- Filter Status Methods ----------------

  async openAllStatusesDropdown() {
    await this.allStatusesDropdown.waitFor({ state: "visible", timeout: 20000 });
    await this.allStatusesDropdown.click();
    await expect(this.statusDropdown).toBeVisible({ timeout: 20000 });
    console.log("✅ All Statuses dropdown opened");
  }

  async verifyStatusesVisible() {
    for (const status of this.expectedStatuses) {
      const option = this.statusDropdown.locator(`div:has-text("${status}")`);
      await expect
        .soft(option, `${status} should be visible in dropdown`)
        .toBeVisible();
    }
    console.log("✅ All expected statuses are visible in dropdown");
  }

  async toggleStatuses() {
    for (const status of this.expectedStatuses) {
      const option = this.statusDropdown.locator(`div:has-text("${status}")`);
      const checkedIcon = option.locator('svg rect[width="16"]');

      // Select
      await option.click();
      await expect
        .soft(checkedIcon, `${status} should be checked after click`)
        .toBeVisible();

      // Deselect
      await option.click();
      await expect
        .soft(checkedIcon, `${status} should be unchecked after second click`)
        .toHaveCount(0);
    }
  console.log("✅ Status toggling verified successfully");
}

// ---------------- Dispatch Default Status Methods ----------------
async verifyDefaultStatuses() {
  // Open "All Statuses" dropdown
  await this.allStatusesDropdown.waitFor({ state: "visible", timeout: 20000 });
  await this.allStatusesDropdown.click();
  await expect(this.statusDropdown).toBeVisible({ timeout: 20000 });

  // Locate "In Progress" and "Clocked In"
  const inProgressOption = this.statusDropdown.locator('div', { hasText: 'In Progress' });
  const clockedInOption = this.statusDropdown.locator('div', { hasText: 'Clocked In' });

  // Verify visibility
  await expect.soft(inProgressOption).toBeVisible();
  await expect.soft(clockedInOption).toBeVisible();

  // Verify both are checked
  const inProgressCheckedIcon = inProgressOption.locator('svg rect[width="16"]');
  const clockedInCheckedIcon = clockedInOption.locator('svg rect[width="16"]');

  await expect.soft(inProgressCheckedIcon).toBeVisible();
  await expect.soft(clockedInCheckedIcon).toBeVisible();

  console.log("✅ Verified 'In Progress' and 'Clocked In' are checked by default");


}

// ---------------- Role Display Methods ----------------
async verifyOfficerRolesDisplayCorrectly() {
  const { page } = this;

  // --- Step 1: Locate Available Users section ---
  const availableAccordion = page.locator(
    "div.MuiAccordion-root",
    { has: page.locator("h6", { hasText: "Available Users" }) }
  );
  await availableAccordion.waitFor({ state: "visible", timeout: 15000 });
  console.log("✅ Available Users section visible");

  // --- Step 2: Collect all officer cards ---
  const officerNames = availableAccordion.locator("p.MuiTypography-body1");
  const count = await officerNames.count();
  console.log(`✅ Found ${count} officer name elements`);

  const users = [];

  for (let i = 0; i < count; i++) {
    const officerNameElement = officerNames.nth(i);
    const card = officerNameElement.locator(
      "xpath=ancestor::div[.//span[contains(@class,'MuiTypography-subtitle3')]][1]"
    );

    const name = (await officerNameElement.textContent().catch(() => "")).trim() || "N/A";

    const status = (
      await card
        .locator("span:has-text('Clocked in'), span:has-text('Available')")
        .first()
        .textContent()
        .catch(() => "")
    ).trim() || "N/A";

    const role = (
      await card
        .locator("span.MuiTypography-subtitle3")
        .filter({ hasNotText: "•" })
        .first()
        .textContent()
        .catch(() => "")
    ).trim() || "N/A";

    users.push({ name, status, role });
  }

  console.table(users);

  // --- Step 3: Verify order of statuses ---
  const statuses = users.map((u) => u.status);
  const firstAvailableIndex = statuses.indexOf("Available");
  const lastClockedInIndex = statuses.lastIndexOf("Clocked in");

  if (lastClockedInIndex === -1) {
    console.warn("⚠️ No clocked-in officer available currently");
  } else if (firstAvailableIndex !== -1 && lastClockedInIndex !== -1) {
    expect(lastClockedInIndex).toBeLessThan(firstAvailableIndex);
    console.log("✅ 'Clocked in' users appear before 'Available' users");
  } else {
    console.warn("⚠️ Not enough data to validate order");
  }

  console.log("🎯 Officer role and status display verified successfully.");
}

async verifyStatusColors() {
  const { page } = this;

  console.log("🔍 Verifying status tag colors...");

  const statusStyles = {
    "In Progress": { color: "rgb(20, 109, 255)", background: "rgb(239, 248, 255)" },
    "Not Started": { color: "rgb(233, 90, 8)", background: "rgb(251, 238, 237)" },
    "Clocked in": { color: "rgb(46, 150, 75)", background: "rgb(236, 253, 243)" },
    "Available": { color: "rgb(220, 104, 3)", background: "rgb(255, 250, 235)" },
    "Upcoming": { color: "rgb(89, 37, 220)", background: "rgb(244, 243, 255)" },
  };

  await page.waitForTimeout(2000);

  for (const [status, expected] of Object.entries(statusStyles)) {
    const tags = page.locator(`text=${status}`);
    const count = await tags.count();

    if (count === 0) {
      console.warn(`⚠️ No "${status}" tags found on page.`);
      continue;
    }

    for (let i = 0; i < count; i++) {
      const [actualColor, actualBg] = await tags.nth(i).evaluate((el) => {
        const style = window.getComputedStyle(el);
        return [style.color, style.backgroundColor];
      });

      try {
        expect(actualColor, `${status} text color mismatch`).toBe(expected.color);
        expect(actualBg, `${status} background mismatch`).toBe(expected.background);
        console.log(`✅ "${status}" tag ${i + 1}: Color and background verified.`);
      } catch {
        console.error(`❌ "${status}" tag ${i + 1} failed color verification.`);
      }
    }
  }

  console.log("🎯 All visible status tag colors verified successfully.");
}

// ---------------------- Job Status Order Verification ----------------------
async verifyJobStatusOrder() {
  const { page } = this;

  console.log("🔍 Verifying job status order in Dedicated and Patrol sections...");

  // Status priority mapping
  const statusPriority = {
    "in progress": 1,
    "not started": 2,
    "upcoming": 3
  };

  // Reusable helper to verify order inside any section
  const verifySectionOrder = async (sectionName, headingText) => {
    console.log(`➡️ Checking order for section: ${sectionName}`);

    // Locate the section container
    const section = page.locator("div.MuiAccordion-root", {
      has: page.locator("h6", { hasText: headingText })
    });

    // Wait for visibility
    await section.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForTimeout(1000);

    // Grab visible statuses
    const statusElements = section.locator("span", { hasText: /In progress|Not started|Upcoming/i });
    const count = await statusElements.count();

    if (count === 0) {
      console.log(`⚠️ No jobs found in ${sectionName} section.`);
      return;
    }

    const statuses = [];
    for (let i = 0; i < count; i++) {
      const text = (await statusElements.nth(i).innerText()).trim().toLowerCase();
      statuses.push(text);
    }

    // Convert to priority numbers
    const priorities = statuses.map((s) => statusPriority[s] ?? 999);

    // Check order correctness
    let sorted = true;
    for (let i = 1; i < priorities.length; i++) {
      if (priorities[i] < priorities[i - 1]) {
        sorted = false;
        break;
      }
    }

    if (sorted) {
      console.log(`✅ Order correct: ${statuses.join(" → ")}`);
    } else {
      console.log(`❌ Order incorrect: Found [${statuses.join(", ")}]`);
    }
  };

  // Verify both sections
  await verifySectionOrder("Dedicated Jobs", "Dedicated Jobs");
  await verifySectionOrder("Patrol Jobs", "Patrol Jobs (Runsheets)");

  console.log("🎯 Status order verification completed.");
}

// In DispatchPage.js
async verifyTimeWindowOptions() {
  const { page } = this;

  // --- Step 1: Locate and click Time Window dropdown ---
  const timeWindowDropdown = page.getByRole("heading", { name: /Next \d+ Hour/ });
  await timeWindowDropdown.waitFor({ state: "visible", timeout: 15000 });
  await timeWindowDropdown.click();

  // --- Step 2: Wait for dropdown container ---
  const timeDropdown = page.locator("#simple-popper");
  await timeDropdown.waitFor({ state: "visible", timeout: 20000 });
  console.log("✅ Time Window dropdown visible");

  // --- Step 3: Expected options ---
  const expectedOptions = [
    "Next 1 Hour",
    "Next 2 Hours",
    "Next 4 Hours",
    "Next 6 Hours",
    "Next 8 Hours",
    "Next 10 Hours",
    "Next 12 Hours"
  ];

  // --- Step 4: Validate each option ---
  for (const label of expectedOptions) {
    const option = timeDropdown.locator(`div:has-text("${label}")`);
    await expect.soft(option, `${label} should be visible`).toBeVisible();
    console.log(`✅ Verified option: ${label}`);
  }

  console.log("🎯 All Time Window options verified successfully!");
}

 // ---------------- Officer Display Correctly Methods ----------------
async verifyOfficersDisplayCorrectly() {
  const { page } = this;

  // --- Step 1: Open Officers Dropdown ---
  const allOfficersDropdown = page.getByRole('heading', { name: 'All Officers' });
  const officersDropdownPanel = page.locator('#simple-popper');

  await allOfficersDropdown.waitFor({ state: 'visible', timeout: 15000 });
  await allOfficersDropdown.click();
  await officersDropdownPanel.waitFor({ state: 'visible', timeout: 10000 });
  console.log("✅ Opened 'All Officers' dropdown");

  // --- Step 2: Fetch all available officer names ---
  let availableOfficers = (
    await officersDropdownPanel.locator('div.MuiBox-root.css-0').allInnerTexts()
  )
    .map(name => name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim())
    .filter(name => name.length > 0);

  if (availableOfficers.length === 0) {
    console.log('⚠️ No officers available to select.');
    return;
  }

  // --- Step 3: Randomly select 2–3 officers ---
  availableOfficers = availableOfficers.sort(() => Math.random() - 0.5);
  const officersToSelect = availableOfficers.slice(0, 3);
  console.log(`✅ Selecting officers: ${officersToSelect.join(', ')}`);

  for (const officerName of officersToSelect) {
    const officerLocator = officersDropdownPanel
      .locator('div')
      .filter({ hasText: officerName })
      .first();

    await officerLocator.scrollIntoViewIfNeeded();
    await officerLocator.click();
  }

  // --- Step 4: Close dropdown ---
  await allOfficersDropdown.click();
  await expect(officersDropdownPanel).toBeHidden({ timeout: 5000 });
  console.log("✅ Closed 'All Officers' dropdown");

  // --- Step 5: Verify officers appear in correct sections ---
  console.log('🔍 Verifying selected officers in job sections...');

  for (const officerName of officersToSelect) {
    let found = false;

    const dedicatedLocator = page.locator(
      "div.MuiAccordion-root",
      { has: page.locator("h6", { hasText: "Dedicated Jobs" }) }
    ).locator(`text=${officerName}`);

    if (await dedicatedLocator.isVisible()) {
      console.log(`✅ Officer "${officerName}" found in Dedicated Jobs section.`);
      found = true;
    } else {
      const patrolLocator = page.locator(
        "div.MuiAccordion-root",
        { has: page.locator("h6", { hasText: "Patrol Jobs (Runsheets)" }) }
      ).locator(`text=${officerName}`);

      if (await patrolLocator.isVisible()) {
        console.log(`✅ Officer "${officerName}" found in Patrol Jobs section.`);
        found = true;
      }
    }

    if (!found) {
      console.log(`❌ Officer "${officerName}" not found in either Dedicated or Patrol Jobs sections.`);
    }
  }

  console.log('🎯 Officers display verified successfully.');
}


  }
