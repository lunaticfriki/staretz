import { useState } from 'preact/hooks'
import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { PostGrid } from '../components/PostGrid.component'
import { PostPreviewSkeleton } from '../components/PostPreview.skeleton'
import { usePostsPageState } from '../usePostsPageState.hook'

const POSTS_PER_PAGE = 5

export function BlogPageContainer(_props: RouteProps) {
  const [page, setPage] = useState(1)
  const state = usePostsPageState(page, POSTS_PER_PAGE)

  return (
    <div>
      <h1 class="mx-auto mb-6 max-w-6xl text-2xl font-bold text-purple-700 dark:text-purple-400">Blog</h1>
      {state.status === 'loading' && (
        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
            <PostPreviewSkeleton key={index} />
          ))}
        </div>
      )}
      {state.status === 'error' && <p class="text-red-600 dark:text-red-400">{state.message}</p>}
      {state.status === 'loaded' && (
        <PostGrid
          totalItems={state.page.totalItems}
          items={state.page.items}
          page={state.page.page}
          totalPages={state.page.totalPages}
          onPageChange={setPage}
          emptyMessage="No s'han trobat articles."
        />
      )}
    </div>
  )
}
