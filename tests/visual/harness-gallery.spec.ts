import { test, expect } from '@playwright/test'

test.describe('Visual Harness Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/harness')
  })

  test('loads the harness page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('UI Component Gallery')
  })

  test('displays components in grid', async ({ page }) => {
    await page.waitForSelector('.component-grid')

    const cards = page.locator('.component-card')
    await expect(await cards.count()).toBeGreaterThan(0)
  })

  test('filters by layer', async ({ page }) => {
    await page.click('button:has-text("shared")')

    const sharedCards = page.locator('.component-card')
    const count = await sharedCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('searches by component name', async ({ page }) => {
    await page.fill('input[type="search"]', 'button')

    const cards = page.locator('.component-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows component metadata on cards', async ({ page }) => {
    const firstCard = page.locator('.component-card').first()

    await expect(firstCard.locator('.component-name')).toBeVisible()
    await expect(firstCard.locator('.layer-badge')).toBeVisible()
    await expect(firstCard.locator('.variant-count')).toBeVisible()
  })

  test('opens Storybook link', async ({ page }) => {
    const storybookLink = page.locator('.storybook-link').first()
    await expect(storybookLink).toHaveAttribute('href', /path=\/story\//)
  })

  test('expands card preview on click', async ({ page }) => {
    const card = page.locator('.component-card').first()
    await card.locator('.card-preview').click()

    await expect(card.locator('.expanded-preview')).toBeVisible()
  })
})
