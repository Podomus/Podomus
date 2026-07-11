import { Page, Locator } from '@playwright/test'

export class ContactPage {
  readonly page: Page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly subjectSelect: Locator
  readonly messageInput: Locator
  readonly submitButton: Locator
  readonly statusMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('#name')
    this.emailInput = page.locator('#email')
    this.phoneInput = page.locator('#phone')
    this.subjectSelect = page.locator('#subject')
    this.messageInput = page.locator('#message')
    this.submitButton = page.locator('button[type="submit"]')
    this.statusMessage = page.locator('.bg-green-100, .bg-red-100')
  }

  async goto() {
    await this.page.goto('/contact')
  }

  async fillForm(data: { name: string; email: string; phone?: string; message: string }) {
    await this.nameInput.fill(data.name)
    await this.emailInput.fill(data.email)
    if (data.phone) {
      await this.phoneInput.fill(data.phone)
    }
    await this.subjectSelect.selectOption('information')
    await this.messageInput.fill(data.message)
  }

  async submit() {
    await this.submitButton.click()
  }
}
