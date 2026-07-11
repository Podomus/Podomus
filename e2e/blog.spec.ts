import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('blog listing page loads', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('networkidle')
  })

  test('blog page has heading', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible()
  })

  test('blog handles empty state or displays posts', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

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
    await page.waitForLoadState('networkidle')

    const categoryLinks = page.locator('a[href*="/blog/category/"]')
    const categoryCount = await categoryLinks.count()

    const tousLink = page.locator('a:has-text("Tous")')
    const tousVisible = await tousLink.isVisible().catch(() => false)

    if (tousVisible) {
      await expect(tousLink).toBeVisible()
      expect(categoryCount).toBeGreaterThan(0)
    }

    for (let i = 0; i < categoryCount; i++) {
      await expect(categoryLinks.nth(i)).toBeVisible()
    }
  })

  test('blog post detail pages resolve', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const postLinks = page.locator('a[href*="/blog/"]').filter({ hasNotText: 'Tous' }).filter({ hasNotText: 'Blog' })
    const linkCount = await postLinks.count()

    test.skip(linkCount === 0, 'No blog posts to test — add posts in Sanity CMS')

    await postLinks.first().click()
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/blog/')
    // Verify actual content rendered on the post page
    await expect(page.locator('article')).toBeVisible()
  })
})
