import { Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

Then('I should see the splash screen', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('status', { name: 'Loading Staretz' })).toBeVisible()
})

When('I wait for the splash screen to finish', async function (this: PlaywrightWorld) {
  await this.page.getByRole('status', { name: 'Loading Staretz' }).waitFor({ state: 'detached' })
})

Then('I should not see the splash screen', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('status', { name: 'Loading Staretz' })).toHaveCount(0)
})
