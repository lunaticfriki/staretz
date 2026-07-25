import { Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

Then('I should see the header title logo', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('banner').getByRole('img', { name: 'Staretz' })).toBeVisible()
})

Then('I should see the footer logo', async function (this: PlaywrightWorld) {
  await expect(this.page.getByRole('contentinfo').getByRole('img', { name: 'Staretz' })).toBeVisible()
})
