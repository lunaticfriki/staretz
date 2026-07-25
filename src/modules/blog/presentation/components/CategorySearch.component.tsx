import { route } from 'preact-router'
import { useEffect, useRef, useState } from 'preact/hooks'
import { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import type { Category } from '../../domain/value-objects/Category.valueObject'
import { useCategoriesState } from '../useCategoriesState.hook'

const DEBOUNCE_MS = 300

interface CategorySearchProps {
  onNavigate?: () => void
}

export function CategorySearch({ onNavigate }: CategorySearchProps) {
  const [term, setTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const categoriesState = useCategoriesState()

  useEffect(() => {
    if (categoriesState.status !== 'loaded') {
      return
    }

    const timeout = setTimeout(() => {
      const criteria = SearchCriteria.create(term)
      setSuggestions(criteria.isEmpty ? [] : categoriesState.categories.matching(criteria).toArray())
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [term, categoriesState])

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

  function navigateToCategory(category: string) {
    setTerm('')
    setSuggestions([])
    setOpen(false)
    route(`/category/${encodeURIComponent(category)}`)
    onNavigate?.()
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    const criteria = SearchCriteria.create(term)
    if (criteria.isEmpty || categoriesState.status !== 'loaded') {
      return
    }

    const matches = categoriesState.categories.matching(criteria).toArray()
    navigateToCategory(matches[0]?.toString() ?? criteria.toString())
  }

  return (
    <div ref={containerRef} class="relative">
      <form onSubmit={handleSubmit} role="search">
        <input
          type="search"
          value={term}
          onInput={(event) => {
            setTerm((event.target as HTMLInputElement).value)
            setOpen(true)
          }}
          placeholder="Cerca per categoria"
          aria-label="Cerca per categoria"
          class="w-full rounded border border-gray-300 bg-transparent px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none sm:w-44 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </form>
      {open && suggestions.length > 0 && (
        <div class="absolute z-10 mt-1 w-full min-w-max rounded-lg border border-gray-200 bg-background py-1 shadow-lg sm:w-44 dark:border-gray-800">
          {suggestions.map((category) => (
            <button
              key={category.toString()}
              type="button"
              onClick={() => navigateToCategory(category.toString())}
              class="block w-full px-3 py-2 text-left text-sm text-purple-600 hover:bg-gray-100 dark:text-purple-400 dark:hover:bg-gray-900"
            >
              {category.toString()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
