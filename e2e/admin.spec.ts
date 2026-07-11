import { test, expect } from '@playwright/test'

test.describe('Admin dashboard', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin')
    // Server redirects /admin -> /admin/dashboard, then client-side auth check redirects to /login
    await page.waitForURL(/login/, { timeout: 15000 })
    expect(page.url()).toContain('/login')
  })
})
