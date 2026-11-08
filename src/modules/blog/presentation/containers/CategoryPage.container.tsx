import { useState } from 'preact/hooks'
import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { PostGrid } from '../components/PostGrid.component'
import { PostSliderSkeleton } from '../components/PostSlider.skeleton'
import { usePostsPageState } from '../usePostsPageState.hook'

const POSTS_PER_PAGE = 5

interface CategoryPageContainerProps extends RouteProps {
  term?: string
}

export function CategoryPageContainer({ term = '' }: CategoryPageContainerProps) {
  const [page, setPage] = useState(1)
  const decodedTerm = decodeURIComponent(term)
  const state = usePostsPageState(page, POSTS_PER_PAGE, decodedTerm)

  return (
    <div>
      <h1 class="mx-auto mb-6 max-w-6xl text-2xl font-bold text-purple-700 dark:text-purple-400">
        Categoria: {decodedTerm}
      </h1>
      {state.status === 'loading' && (
        <PostSliderSkeleton count={POSTS_PER_PAGE} />
      )}
      {state.status === 'error' && <p class="text-red-600 dark:text-red-400">{state.message}</p>}
      {state.status === 'loaded' && (
        <PostGrid
          totalItems={state.page.totalItems}
          items={state.page.items}
          page={state.page.page}
          totalPages={state.page.totalPages}
          onPageChange={setPage}
          emptyMessage={`No s'han trobat articles per a "${decodedTerm}".`}
        />
      )}
    </div>
  )
}
