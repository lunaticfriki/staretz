import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { PostPreview } from '../components/PostPreview.component'
import { PostPreviewSkeleton } from '../components/PostPreview.skeleton'
import { useRecentPostsState } from '../useRecentPostsState.hook'

const RECENT_POSTS_LIMIT = 5

export function HomeContainer(_props: RouteProps) {
  const state = useRecentPostsState(RECENT_POSTS_LIMIT)

  if (state.status === 'loading') {
    return (
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: RECENT_POSTS_LIMIT }).map((_, index) => (
          <PostPreviewSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (state.status === 'error') {
    return <p class="text-red-600 dark:text-red-400">{state.message}</p>
  }

  return (
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.posts.toArray().map((post) => (
        <PostPreview key={post.slug.toString()} post={post} />
      ))}
    </div>
  )
}
