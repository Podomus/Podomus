import { test, expect } from '@playwright/test'

test.describe('Public pages', () => {
  test('homepage loads and displays header and footer', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('about page loads', async ({ page }) => {
    const response = await page.goto('/a_propos')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('services page loads', async ({ page }) => {
    const response = await page.goto('/service')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('blog page loads', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('contact page loads', async ({ page }) => {
    const response = await page.goto('/contact')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('login page loads', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('privacy page loads', async ({ page }) => {
    const response = await page.goto('/privacy')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('terms page loads', async ({ page }) => {
    const response = await page.goto('/terms')
    expect(response?.ok()).toBeTruthy()
    await page.waitForLoadState('load')
  })

  test('admin page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL(/login/, { timeout: 15000 })
    expect(page.url()).toContain('login')
  })
})
