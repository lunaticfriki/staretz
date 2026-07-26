import { Given, Then, When } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { PlaywrightWorld } from '../support/world'

Given('I am on the home page', async function (this: PlaywrightWorld) {
  await this.page.goto('/')
})

Given('I am on the about page', async function (this: PlaywrightWorld) {
  await this.page.goto('/about')
})

Given('I am on the blog page', async function (this: PlaywrightWorld) {
  await this.page.goto('/blog')
})

Given('I am on the post page for {string}', async function (this: PlaywrightWorld, slug: string) {
  await this.page.goto(`/blog/${slug}`)
})

When('I click the {string} link in the header', async function (this: PlaywrightWorld, label: string) {
  await this.page.getByRole('banner').getByRole('link', { name: label }).click()
})

When('I click on the post titled {string}', async function (this: PlaywrightWorld, title: string) {
  await this.page.getByRole('link', { name: title }).click()
})

When('I click the {string} link', async function (this: PlaywrightWorld, label: string) {
  await this.page.getByRole('link', { name: label }).click()
})

Then('I should be on the home page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/$/)
})

Then('I should be on the about page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/about$/)
})

Then('I should be on the blog page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/blog$/)
})

Then('I should be on the dashboard page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/dashboard$/)
})

Then('I should be on the post page for {string}', async function (this: PlaywrightWorld, slug: string) {
  await expect(this.page).toHaveURL(new RegExp(`/blog/${slug}$`))
})

Then('I should see the heading {string}', async function (this: PlaywrightWorld, text: string) {
  await expect(this.page.getByRole('heading', { name: text }).first()).toBeVisible()
})

Then('I should see the text {string}', async function (this: PlaywrightWorld, text: string) {
  await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible()
})
