import { route } from 'preact-router'
import { useState } from 'preact/hooks'

export function CategorySearch() {
  const [term, setTerm] = useState('')

  function handleSubmit(event: Event) {
    event.preventDefault()
    const trimmed = term.trim()
    if (!trimmed) {
      return
    }
    route(`/category/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={term}
        onInput={(event) => setTerm((event.target as HTMLInputElement).value)}
        placeholder="Cerca per categoria"
        aria-label="Cerca per categoria"
        class="w-36 rounded border border-gray-300 bg-transparent px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none sm:w-44 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
      />
    </form>
  )
}
