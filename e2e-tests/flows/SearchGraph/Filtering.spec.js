const { test, expect } = require('../../../fixtures');


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('NTIRPs Search filtering', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await page.getByRole('button', { name: " Visualize Your Data" }).click()
    await page.getByText("test1").click()
    await page.waitForTimeout(3000)
    await page.getByText("NTIRPs Search").click()
    await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.getByRole("button", { name: "Search" }).click()
    await page.waitForTimeout(3000)
});

test.only('NTIRPs Search filtering by params', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  const inputElementMax = await page.$('.limits-table input[name="maxVSCls0"]');
  await inputElementMax.fill('70');
  await inputElementMax.dispatchEvent('input');

  const inputElementMin = await page.$('.limits-table input[name="minVSCls0"]');
  await inputElementMin.fill('50');
  await inputElementMin.dispatchEvent('input');

  await page.waitForTimeout(3000)
  // await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  // await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(3000)
});
