import type { PostSortField } from '../../../blog/domain/collections/Post.collection'
import type { Post } from '../../../blog/domain/entities/Post.entity'
import type { SortCriteria } from '../../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'

interface PostsTableProps {
  posts: Post[]
  deletingSlug: string | null
  onDelete: (slug: string) => void
  sort: SortCriteria<PostSortField>
  onSortChange: (sort: SortCriteria<PostSortField>) => void
  emptyMessage: string
}

const SORTABLE_COLUMNS: Array<{ field: PostSortField; label: string }> = [
  { field: 'title', label: 'Títol' },
  { field: 'category', label: 'Categoria' },
  { field: 'publishedAt', label: 'Publicat' },
]

export function PostsTable({ posts, deletingSlug, onDelete, sort, onSortChange, emptyMessage }: PostsTableProps) {
  if (posts.length === 0) {
    return <p class="text-gray-600 dark:text-gray-300">{emptyMessage}</p>
  }

  return (
    <>
      <div class="hidden overflow-x-auto sm:block">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              {SORTABLE_COLUMNS.map(({ field, label }) => {
                const active = sort.field === field
                const arrow = active ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'

                return (
                  <th key={field} class="py-2 pr-4 font-medium">
                    <button
                      type="button"
                      onClick={() => onSortChange(sort.toggled(field))}
                      aria-label={`Ordena per ${label}`}
                      class={`flex items-center gap-1 hover:text-purple-700 dark:hover:text-purple-300 ${
                        active ? 'text-purple-700 dark:text-purple-400' : ''
                      }`}
                    >
                      {label}
                      <span aria-hidden="true" class="text-xs">
                        {arrow}
                      </span>
                    </button>
                  </th>
                )
              })}
              <th class="py-2 font-medium">Accions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const slug = post.slug.toString()
              const deleting = deletingSlug === slug

              return (
                <tr key={slug} class="border-b border-gray-100 dark:border-gray-900">
                  <td class="py-2 pr-4">{post.title.toString()}</td>
                  <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">{post.category.toString()}</td>
                  <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    {post.publishedAt.toDate().toLocaleDateString()}
                  </td>
                  <td class="py-2">
                    <div class="flex gap-3">
                      <a
                        href={`/dashboard/edit/${encodeURIComponent(slug)}`}
                        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
                      >
                        Edita
                      </a>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => onDelete(slug)}
                        class="text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {deleting ? 'Eliminant...' : 'Elimina'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div class="sm:hidden">
        <div class="mb-3 flex flex-wrap gap-2">
          {SORTABLE_COLUMNS.map(({ field, label }) => {
            const active = sort.field === field
            const arrow = active ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'

            return (
              <button
                key={field}
                type="button"
                onClick={() => onSortChange(sort.toggled(field))}
                aria-label={`Ordena per ${label}`}
                class={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:text-purple-700 dark:hover:text-purple-300 ${
                  active
                    ? 'border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-400'
                    : 'border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400'
                }`}
              >
                {label}
                <span aria-hidden="true">{arrow}</span>
              </button>
            )
          })}
        </div>

        <ul class="flex flex-col gap-3">
          {posts.map((post) => {
            const slug = post.slug.toString()
            const deleting = deletingSlug === slug

            return (
              <li key={slug} class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <p class="font-semibold text-purple-700 dark:text-purple-400">{post.title.toString()}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {post.category.toString()} · {post.publishedAt.toDate().toLocaleDateString()}
                </p>
                <div class="mt-3 flex gap-4 text-sm">
                  <a
                    href={`/dashboard/edit/${encodeURIComponent(slug)}`}
                    class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
                  >
                    Edita
                  </a>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => onDelete(slug)}
                    class="text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {deleting ? 'Eliminant...' : 'Elimina'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
