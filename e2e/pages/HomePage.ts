import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly header: Locator
  readonly footer: Locator
  readonly navLinks: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('header')
    this.footer = page.locator('footer')
    this.navLinks = page.locator('nav a')
  }

  async goto() {
    await this.page.goto('/')
  }

  async getTitle() {
    return await this.page.title()
  }
}
