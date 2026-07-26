import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import { useRouter } from 'preact-router'

import { CategoryMenu } from '../../modules/blog/presentation/components/CategoryMenu.component'
import { CategorySearch } from '../../modules/blog/presentation/components/CategorySearch.component'
import { ThemeToggle } from './ThemeToggle.component'

function navLinkClass(active: boolean) {
  return active ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-900 dark:hover:text-purple-200'
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [router] = useRouter()
  const currentPath = router.url.split('?')[0]
  const isHome = currentPath === '/'
  const isBlog = currentPath === '/blog' || currentPath.startsWith('/blog/')
  const isAbout = currentPath === '/about'

  useLayoutEffect(() => {
    const element = headerRef.current
    if (!element) {
      return
    }

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${element.offsetHeight}px`,
      )
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header ref={headerRef} class="">
      <div class="flex items-center justify-between gap-4 px-4 py-4 mb-2 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center" onClick={closeMobileMenu}>
          <img
            src="/title-black.jpg"
            alt="Staretz"
            class="h-8 w-auto invert dark:invert-0"
          />
        </a>

        <div class="hidden items-center gap-6 sm:flex">
          <nav class="flex gap-6 text-sm">
            <a href="/" aria-current={isHome ? 'page' : undefined} class={navLinkClass(isHome)}>
              Inici
            </a>
            <a href="/blog" aria-current={isBlog ? 'page' : undefined} class={navLinkClass(isBlog)}>
              Blog
            </a>
            <a href="/about" aria-current={isAbout ? 'page' : undefined} class={navLinkClass(isAbout)}>
              Sobre Staretz
            </a>
            <CategoryMenu />
          </nav>
          <CategorySearch />
          <ThemeToggle />
        </div>

        <div class="flex items-center gap-4 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Tanca el menú' : 'Obre el menú'}
            class="text-2xl leading-none text-purple-600 dark:text-purple-400"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          class="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:hidden dark:border-gray-800"
        >
          <nav class="flex flex-col gap-4 text-sm">
            <a
              href="/"
              onClick={closeMobileMenu}
              aria-current={isHome ? 'page' : undefined}
              class={navLinkClass(isHome)}
            >
              Inici
            </a>
            <a
              href="/blog"
              onClick={closeMobileMenu}
              aria-current={isBlog ? 'page' : undefined}
              class={navLinkClass(isBlog)}
            >
              Blog
            </a>
            <a
              href="/about"
              onClick={closeMobileMenu}
              aria-current={isAbout ? 'page' : undefined}
              class={navLinkClass(isAbout)}
            >
              Sobre Staretz
            </a>
            <CategoryMenu onNavigate={closeMobileMenu} />
          </nav>
          <CategorySearch onNavigate={closeMobileMenu} />
        </div>
      )}
    </header>
  )
}
