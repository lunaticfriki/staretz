import { useEffect, useRef, useState } from 'preact/hooks'

import type { Category } from '../../domain/value-objects/Category.valueObject'
import { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { route } from 'preact-router'
import { useCategoriesState } from '../useCategoriesState.hook'
import { PixelSearchIcon } from '../../../../shared/presentation/icons/PixelSearchIcon.component'

const DEBOUNCE_MS = 300

interface CategorySearchProps {
  onNavigate?: () => void
  collapsible?: boolean
}

export function CategorySearch({ onNavigate, collapsible = false }: CategorySearchProps) {
  const [term, setTerm] = useState('')
  const [expanded, setExpanded] = useState(!collapsible)
  const inputRef = useRef<HTMLInputElement>(null)
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
      setSuggestions(
        criteria.isEmpty
          ? []
          : categoriesState.categories.matching(criteria).toArray(),
      )
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [term, categoriesState])

  useEffect(() => {
    if (collapsible && expanded) {
      inputRef.current?.focus()
    }
  }, [collapsible, expanded])

  useEffect(() => {
    if (!open && !(collapsible && expanded)) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        if (collapsible) {
          setExpanded(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open, collapsible, expanded])

  function navigateToCategory(category: string) {
    setTerm('')
    setSuggestions([])
    setOpen(false)
    if (collapsible) {
      setExpanded(false)
    }
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
    <div ref={containerRef} class="relative flex items-center gap-2">
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Amaga la cerca' : 'Obre la cerca'}
          class="text-lg text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
        >
          <PixelSearchIcon />
        </button>
      )}
      <form onSubmit={handleSubmit} role="search" hidden={!expanded} class="w-full">
        <input
          ref={inputRef}
          type="search"
          value={term}
          onInput={(event) => {
            setTerm((event.target as HTMLInputElement).value)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (collapsible && event.key === 'Escape') {
              setOpen(false)
              setExpanded(false)
            }
          }}
          placeholder="Cerca..."
          aria-label="Cerca per categoria"
          class="w-full rounded border border-gray-300 bg-transparent px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none sm:w-44 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </form>
      {expanded && open && suggestions.length > 0 && (
        <div class="absolute right-0 top-full z-10 mt-1 w-full min-w-max rounded-lg border border-gray-200 bg-background py-1 shadow-lg sm:w-44 dark:border-gray-800">
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
