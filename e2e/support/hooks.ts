import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium, type Browser, type BrowserContext } from '@playwright/test'
import type { PlaywrightWorld } from './world'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'

// Cucumber's own 5000ms default step timeout can be tighter than a real
// network round trip to Firestore takes under load — raise it so a slow
// read fails on its own assertion message, not a generic step timeout.
setDefaultTimeout(15000)

let browser: Browser
let context: BrowserContext

BeforeAll(async function () {
  browser = await chromium.launch()
})

AfterAll(async function () {
  await browser.close()
})

Before(async function (this: PlaywrightWorld) {
  context = await browser.newContext({ baseURL: BASE_URL })
  this.page = await context.newPage()
})

After(async function () {
  await context.close()
})
