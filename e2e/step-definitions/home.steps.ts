import { Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

When('I go to page {string} of the posts', async function (this: PlaywrightWorld, page: string) {
  await this.page
    .getByRole('navigation', { name: 'Paginació' })
    .getByRole('button', { name: page, exact: true })
    .click()
})

Then('I should see {int} post previews', async function (this: PlaywrightWorld, count: number) {
  await expect(this.page.getByRole('heading', { level: 2 })).toHaveCount(count)
})

Then('the first post should be {string}', async function (this: PlaywrightWorld, title: string) {
  await expect(this.page.getByRole('heading', { level: 2 }).first()).toHaveText(title)
})
