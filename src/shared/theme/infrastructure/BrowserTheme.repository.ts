import { Theme } from '../domain/value-objects/Theme.valueObject'
import { ThemeRepository } from '../domain/repositories/Theme.repository'

const STORAGE_KEY = 'staretz:theme'

export class BrowserThemeRepository extends ThemeRepository {
  getPersisted(): Theme | null {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? Theme.create(stored) : null
  }

  getSystemPreference(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark() : Theme.light()
  }

  persist(theme: Theme): void {
    window.localStorage.setItem(STORAGE_KEY, theme.toString())
  }

  apply(theme: Theme): void {
    window.document.documentElement.classList.toggle('dark', theme.mode === 'dark')
  }
}
