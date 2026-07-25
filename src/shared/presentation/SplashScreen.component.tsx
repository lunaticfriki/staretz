import { useEffect, useState } from 'preact/hooks'

const VISIBLE_DURATION_MS = 1500
const FADE_DURATION_MS = 1000

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), VISIBLE_DURATION_MS)
    const removeTimer = setTimeout(
      () => setVisible(false),
      VISIBLE_DURATION_MS + FADE_DURATION_MS,
    )

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div
      class={`fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-2500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src="/logo-black.jpg"
        alt="Staretz"
        class="h-100 w-auto invert dark:invert-0"
      />
    </div>
  )
}
