import { DomainError } from '../../../errors/domain/Domain.error'

export type ThemeMode = 'light' | 'dark'

export class InvalidThemeModeError extends DomainError {
  constructor(value: string) {
    super(`"${value}" is not a valid theme mode`)
  }
}

export class Theme {
  private constructor(public readonly mode: ThemeMode) {}

  static create(mode: string): Theme {
    if (mode !== 'light' && mode !== 'dark') {
      throw new InvalidThemeModeError(mode)
    }
    return new Theme(mode)
  }

  static light(): Theme {
    return new Theme('light')
  }

  static dark(): Theme {
    return new Theme('dark')
  }

  toggle(): Theme {
    return this.mode === 'light' ? Theme.dark() : Theme.light()
  }

  equals(other: Theme): boolean {
    return this.mode === other.mode
  }

  toString(): ThemeMode {
    return this.mode
  }
}
