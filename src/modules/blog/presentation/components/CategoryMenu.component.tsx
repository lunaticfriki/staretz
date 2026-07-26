import { useEffect, useRef, useState } from 'preact/hooks'
import { useRouter } from 'preact-router'
import { useCategoriesState } from '../useCategoriesState.hook'

interface CategoryMenuProps {
  onNavigate?: () => void
}

const CATEGORY_PATH_PREFIX = '/category/'

export function CategoryMenu({ onNavigate }: CategoryMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const state = useCategoriesState()
  const [router] = useRouter()

  const currentPath = router.url.split('?')[0]
  const isCategoryActive = currentPath.startsWith(CATEGORY_PATH_PREFIX)
  const activeCategory = isCategoryActive
    ? decodeURIComponent(currentPath.slice(CATEGORY_PATH_PREFIX.length))
    : null

  useEffect(() => {
    if (!open) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} class="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={isCategoryActive ? 'page' : undefined}
        class={
          isCategoryActive
            ? 'text-purple-600 dark:text-purple-400'
            : 'hover:text-purple-900 dark:hover:text-purple-200'
        }
      >
        Categories ▾
      </button>
      {open && state.status === 'loaded' && (
        <div class="absolute left-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-background py-1 shadow-lg sm:right-0 sm:left-auto dark:border-gray-800">
          {state.categories.length === 0 ? (
            <p class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Sense categories</p>
          ) : (
            state.categories.toArray().map((category) => {
              const label = category.toString()
              const isActive = label === activeCategory

              return (
                <a
                  key={label}
                  href={`/category/${encodeURIComponent(label)}`}
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  class={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900 ${
                    isActive ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-900 dark:hover:text-purple-200'
                  }`}
                >
                  {label}
                </a>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
