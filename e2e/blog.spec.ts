import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('blog listing page loads', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.ok()).toBeTruthy()
  })

  test('blog page has heading', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('load')
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible()
  })

  test('blog handles empty state or displays posts', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('load')

    const emptyState = page.locator('text=Aucun article')
    const blogGrid = page.locator('[class*="grid"] article, article')

    const emptyVisible = await emptyState.isVisible().catch(() => false)
    const gridCount = await blogGrid.count()

    if (emptyVisible) {
      expect(gridCount).toBe(0)
    } else {
      expect(gridCount).toBeGreaterThan(0)
    }
  })

  test('category section renders when categories exist', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('load')

    const categoryLinks = page.locator('a[href*="/blog/category/"]')
    const categoryCount = await categoryLinks.count()

    const tousLink = page.locator('a:has-text("Tous")')
    const tousVisible = await tousLink.isVisible().catch(() => false)

    if (tousVisible) {
      await expect(tousLink).toBeVisible()
      expect(categoryCount).toBeGreaterThan(0)
      for (let i = 0; i < categoryCount; i++) {
        await expect(categoryLinks.nth(i)).toBeVisible()
      }
    }
  })

  test('blog post detail pages resolve', async ({ page }) => {
    await page.goto('/blog/bienfaits-podologie-preventive')
    await page.waitForLoadState('load')

    await expect(page.locator('h1')).toBeVisible({ timeout: 20000 })
    expect(page.url()).toContain('/blog/bienfaits')
  })
})
