import { Page, Locator } from '@playwright/test'

export class AdminPage {
  readonly page: Page
  readonly sidebar: Locator
  readonly dashboardLink: Locator
  readonly patientsLink: Locator
  readonly appointmentsLink: Locator
  readonly orthesesLink: Locator
  readonly messagesLink: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = page.locator('aside, [class*="sidebar"]')
    this.dashboardLink = page.locator('a[href*="dashboard"]')
    this.patientsLink = page.locator('a[href*="patients"]')
    this.appointmentsLink = page.locator('a[href*="appointments"]')
    this.orthesesLink = page.locator('a[href*="ortheses"]')
    this.messagesLink = page.locator('a[href*="messages"]')
  }

  async goto() {
    await this.page.goto('/admin')
  }

  async gotoDashboard() {
    await this.page.goto('/admin/dashboard')
  }
}
