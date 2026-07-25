import type { Post } from '../../../blog/domain/entities/Post.entity'

interface PostsTableProps {
  posts: Post[]
  deletingSlug: string | null
  onDelete: (slug: string) => void
}

export function PostsTable({ posts, deletingSlug, onDelete }: PostsTableProps) {
  if (posts.length === 0) {
    return <p class="text-gray-600 dark:text-gray-300">Encara no hi ha cap article.</p>
  }

  return (
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th class="py-2 pr-4 font-medium">Títol</th>
            <th class="py-2 pr-4 font-medium">Categoria</th>
            <th class="py-2 pr-4 font-medium">Publicat</th>
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
  )
}
