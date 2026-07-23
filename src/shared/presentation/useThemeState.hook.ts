import { useEffect } from 'preact/hooks'
import { container } from '../../composition-root'
import type { Theme } from '../theme/domain/value-objects/Theme.valueObject'
import type { ThemeStateService } from '../theme/application/Theme.stateService'
import { TYPES } from '../di/types'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export function useThemeState(): ThemeState {
  const themeStateService = container.get<ThemeStateService>(TYPES.ThemeStateService)

  useEffect(() => {
    themeStateService.initialize()
  }, [])

  return {
    theme: themeStateService.theme.value,
    toggle: () => themeStateService.toggle(),
  }
}
