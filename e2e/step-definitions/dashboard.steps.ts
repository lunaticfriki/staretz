import { Given, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

const MOBILE_VIEWPORT = { width: 375, height: 700 }

Given('I am logged in as an admin', async function (this: PlaywrightWorld) {
  const email = process.env.E2E_ADMIN_EMAIL ?? 'e2e@staretz.test'
  const password = process.env.E2E_ADMIN_PASSWORD ?? 'e2e-test-password'

  await this.page.goto('/login')
  await this.page.getByLabel('Correu electrònic').fill(email)
  await this.page.getByLabel('Contrasenya').fill(password)
  await this.page.getByRole('button', { name: 'Entra' }).click()
  await this.page.waitForURL(/\/dashboard$/)
})

Given('my screen is mobile-sized', async function (this: PlaywrightWorld) {
  await this.page.setViewportSize(MOBILE_VIEWPORT)
})

Then('I should see the posts as a table', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('table')).toBeVisible()
})

Then('I should see the posts as cards', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('table')).toBeHidden()
  await expect(this.page.getByRole('list')).toBeVisible()
})
