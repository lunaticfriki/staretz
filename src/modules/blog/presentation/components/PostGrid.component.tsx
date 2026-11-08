import { Pagination } from '../../../../shared/presentation/Pagination.component'
import type { Post } from '../../domain/entities/Post.entity'
import { PostSlider } from './PostSlider.component'

interface PostGridProps {
  totalItems: number
  items: Post[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  emptyMessage: string
}

export function PostGrid({ totalItems, items, page, totalPages, onPageChange, emptyMessage }: PostGridProps) {
  return (
    <div class="mx-auto w-full max-w-6xl">
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Nombre de posts: <span class="font-semibold text-purple-700 dark:text-purple-400">{totalItems}</span>
      </p>
      {items.length === 0 ? (
        <p class="text-gray-600 dark:text-gray-300">{emptyMessage}</p>
      ) : (
        <PostSlider posts={items} />
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}
