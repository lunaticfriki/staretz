import { Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

When('I open the category menu', async function (this: PlaywrightWorld) {
  await this.page.getByRole('button', { name: 'Categories' }).click()
})

When('I click the {string} category in the menu', async function (this: PlaywrightWorld, category: string) {
  await this.page.getByRole('link', { name: category, exact: true }).click()
})

When('I search for {string} in the category search box', async function (this: PlaywrightWorld, term: string) {
  await this.page.getByRole('searchbox', { name: 'Cerca per categoria' }).fill(term)
  await this.page.keyboard.press('Enter')
})

Then('I should be on the category page for {string}', async function (this: PlaywrightWorld, term: string) {
  await expect(this.page).toHaveURL(new RegExp(`/category/${encodeURIComponent(term)}$`))
})
