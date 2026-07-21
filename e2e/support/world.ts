import { World, setWorldConstructor } from '@cucumber/cucumber'
import type { IWorldOptions } from '@cucumber/cucumber'
import type { Page } from '@playwright/test'

export class PlaywrightWorld extends World {
  page!: Page

  constructor(options: IWorldOptions) {
    super(options)
  }
}

setWorldConstructor(PlaywrightWorld)
