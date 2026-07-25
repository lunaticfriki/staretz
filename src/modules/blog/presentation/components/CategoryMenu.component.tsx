import { useEffect, useRef, useState } from 'preact/hooks'
import { useCategoriesState } from '../useCategoriesState.hook'

export function CategoryMenu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const state = useCategoriesState()

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
        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
      >
        Categories ▾
      </button>
      {open && state.status === 'loaded' && (
        <div class="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-background py-1 shadow-lg dark:border-gray-800">
          {state.categories.length === 0 ? (
            <p class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Sense categories</p>
          ) : (
            state.categories.map((category) => (
              <a
                key={category.toString()}
                href={`/category/${encodeURIComponent(category.toString())}`}
                onClick={() => setOpen(false)}
                class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100 dark:text-purple-400 dark:hover:bg-gray-900"
              >
                {category.toString()}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
