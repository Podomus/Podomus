import { test, expect } from '@playwright/test'
import { ContactPage } from './pages/ContactPage'

test.describe('Contact form', () => {
  test('displays contact form fields', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()

    await expect(contact.nameInput).toBeVisible()
    await expect(contact.emailInput).toBeVisible()
    await expect(contact.subjectSelect).toBeVisible()
    await expect(contact.messageInput).toBeVisible()
  })

  test('submits contact form and shows success message', async ({ page }) => {
    // Intercept the API call so the test isn't dependent on SMTP credentials
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message envoyé avec succès' }),
      })
    })

    const contact = new ContactPage(page)
    await contact.goto()

    await contact.fillForm({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
      message: 'Bonjour, je souhaite prendre un rendez-vous pour une consultation.',
    })

    await contact.submit()

    // Should show the green success banner
    await expect(page.locator('.bg-green-100')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Merci pour votre message')).toBeVisible()
  })

  test('shows error when API returns 500', async ({ page }) => {
    // Simulate a server error
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erreur interne du serveur' }),
      })
    })

    const contact = new ContactPage(page)
    await contact.goto()

    await contact.fillForm({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: 'Message test.',
    })

    await contact.submit()

    // Should show the red error banner
    await expect(page.locator('.bg-red-100')).toBeVisible({ timeout: 10000 })
  })
})
