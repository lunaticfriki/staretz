import { Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

Then('I should see {int} post previews', async function (this: PlaywrightWorld, count: number) {
  await expect(this.page.getByRole('heading', { level: 2 })).toHaveCount(count)
})

Then('the first post should be {string}', async function (this: PlaywrightWorld, title: string) {
  await expect(this.page.getByRole('heading', { level: 2 }).first()).toHaveText(title)
})
