import { useEffect, useState } from 'preact/hooks'

const DEBOUNCE_MS = 300

interface PostsSearchProps {
  onSearch: (term: string) => void
}

export function PostsSearch({ onSearch }: PostsSearchProps) {
  const [term, setTerm] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(term), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [term])

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <input
        type="search"
        value={term}
        onInput={(event) => setTerm((event.target as HTMLInputElement).value)}
        placeholder="Cerca articles..."
        aria-label="Cerca articles"
        class="w-full rounded border border-gray-300 bg-transparent px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none sm:w-64 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
      />
    </form>
  )
}
