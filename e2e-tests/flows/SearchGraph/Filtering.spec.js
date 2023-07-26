const { test, expect } = require('../../../fixtures');


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('NTIRPs Search filtering', async ({ page }) => {
    await page.getByRole('button', { name: " Visualize Your Data" }).click()
    await page.getByText("test1").click()
    await page.waitForTimeout(3000)
    await page.getByText("NTIRPs Search").click()
    await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.getByRole("button", { name: "Search" }).click()
    await page.waitForTimeout(3000)
});

test('NTIRPs Search filtering by V.S and M.H.S', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  const inputElementMax_VS = await page.$('.limits-table input[name="maxVSCls0"]')
  await inputElementMax_VS.fill('80')
  await inputElementMax_VS.dispatchEvent('input')
  const inputElementMin_VS = await page.$('.limits-table input[name="minVSCls0"]')
  await inputElementMin_VS.fill('50')
  await inputElementMin_VS.dispatchEvent('input')

  const inputElementMax_MHS = await page.$('.limits-table input[name="maxHSCls0"]')
  await inputElementMax_MHS.fill('99')
  await inputElementMax_MHS.dispatchEvent('input')
  const inputElementMin_MHS = await page.$('.limits-table input[name="minHSCls0"]')
  await inputElementMin_MHS.fill('3')
  await inputElementMin_MHS.dispatchEvent('input')


  await page.waitForTimeout(3000)

  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(3000)
});

test('NTIRPs Search copmlete filtering', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  await page.locator('.col-sm-4').nth(0).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.waitForTimeout(3000)

  const inputElementMin_VS = await page.$('.limits-table input[name="minVSCls0"]')
  await inputElementMin_VS.fill('50')
  await inputElementMin_VS.dispatchEvent('input')

  await page.waitForTimeout(3000)

  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(3000)
});

test('NTIRPs Search check visable', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  await page.waitForSelector('[test_id="bubble graph"]');
  const isBubbleVisible = await page.evaluate(() => {
    const bubble = document.querySelector('[test_id="bubble graph"]');
    const isVisible = bubble.offsetHeight > 0 && bubble.offsetWidth > 0;
    return isVisible
  });

  expect(isBubbleVisible).toBe(true);
});
