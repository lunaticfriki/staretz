import { Theme } from '../value-objects/Theme.valueObject'

export abstract class ThemeRepository {
  abstract getPersisted(): Theme | null
  abstract getSystemPreference(): Theme
  abstract persist(theme: Theme): void
  abstract apply(theme: Theme): void
}
