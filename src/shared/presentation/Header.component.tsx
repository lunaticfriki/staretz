import { ThemeToggle } from './ThemeToggle.component'

export function Header() {
  return (
    <header class="">
      <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center">
          <img
            src="/title-black.jpg"
            alt="Staretz"
            class="h-8 w-auto invert dark:invert-0"
          />
        </a>
        <div class="flex items-center gap-6">
          <nav class="flex gap-6 text-sm text-purple-600 dark:text-purple-400">
            <a
              href="/"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              Home
            </a>
            <a
              href="/about"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              About
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
