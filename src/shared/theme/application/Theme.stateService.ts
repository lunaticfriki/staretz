import { signal, type Signal } from '@preact/signals-core'
import { Theme } from '../domain/value-objects/Theme.valueObject'
import type { ThemeRepository } from '../domain/repositories/Theme.repository'

export abstract class ThemeStateService {
  abstract readonly theme: Signal<Theme>
  abstract initialize(): void
  abstract toggle(): void
}

export class ThemeStateServiceImpl extends ThemeStateService {
  readonly theme = signal<Theme>(Theme.light())

  constructor(private readonly themeRepository: ThemeRepository) {
    super()
  }

  initialize(): void {
    const theme = this.themeRepository.getPersisted() ?? this.themeRepository.getSystemPreference()
    this.setTheme(theme)
  }

  toggle(): void {
    this.setTheme(this.theme.value.toggle())
  }

  private setTheme(theme: Theme): void {
    this.theme.value = theme
    this.themeRepository.persist(theme)
    this.themeRepository.apply(theme)
  }
}
