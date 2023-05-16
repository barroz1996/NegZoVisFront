const { test, expect } = require('../../../fixtures');


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('NTIRPs Search filtering', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await page.getByRole('button', { name: " Visualize Your Data" }).click()
    await page.getByText("test6").click()
    await page.waitForTimeout(3000)
    await page.getByText("NTIRPs Search").click()
    await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.getByRole("button", { name: "Search" }).click()
    await page.waitForTimeout(3000)
});
