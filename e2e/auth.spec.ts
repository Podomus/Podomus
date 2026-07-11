import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test.describe('Authentication', () => {
  test('login page has email and password fields', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()

    await expect(login.emailInput).toBeVisible()
    await expect(login.passwordInput).toBeVisible()
    await expect(login.submitButton).toBeVisible()
  })

  test('login form has required attributes', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()

    await expect(login.emailInput).toHaveAttribute('required', '')
    await expect(login.passwordInput).toHaveAttribute('required', '')
    await expect(login.emailInput).toHaveAttribute('type', 'email')
    await expect(login.passwordInput).toHaveAttribute('type', 'password')
  })
})
