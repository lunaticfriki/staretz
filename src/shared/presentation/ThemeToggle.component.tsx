import { PixelMoonIcon } from './icons/PixelMoonIcon.component'
import { PixelSunIcon } from './icons/PixelSunIcon.component'
import { useThemeState } from './useThemeState.hook'

export function ThemeToggle() {
  const { theme, toggle } = useThemeState()
  const isDark = theme.mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      class="text-lg text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
    >
      {isDark ? <PixelSunIcon /> : <PixelMoonIcon />}
    </button>
  )
}
