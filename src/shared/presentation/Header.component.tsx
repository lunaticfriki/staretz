import { useLayoutEffect, useRef } from 'preact/hooks'
import { CategoryMenu } from '../../modules/blog/presentation/components/CategoryMenu.component'
import { CategorySearch } from '../../modules/blog/presentation/components/CategorySearch.component'
import { ThemeToggle } from './ThemeToggle.component'

export function Header() {
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = headerRef.current
    if (!element) {
      return
    }

    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${element.offsetHeight}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <header ref={headerRef} class="">
      <div class="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center">
          <img
            src="/title-black.jpg"
            alt="Staretz"
            class="h-8 w-auto invert dark:invert-0"
          />
        </a>
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav class="flex gap-6 text-sm">
            <a
              href="/"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              Inici
            </a>
            <a
              href="/about"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              Quant a
            </a>
            <CategoryMenu />
          </nav>
          <CategorySearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
