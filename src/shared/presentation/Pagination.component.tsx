interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Paginació"
      class="mt-2 flex items-center justify-center gap-2 text-sm"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        class="px-2  hover:text-purple-900 disabled:pointer-events-none disabled:opacity-30  dark:hover:text-purple-200"
      >
        ← Anterior
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          class={`h-8 w-8 rounded ${
            p === page
              ? 'bg-purple-700 font-bold text-white dark:bg-purple-400 dark:text-black'
              : 'text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        class="px-2  hover:text-purple-900 disabled:pointer-events-none disabled:opacity-30  dark:hover:text-purple-200"
      >
        Següent →
      </button>
    </nav>
  )
}
