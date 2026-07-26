import { PostPreview } from '../components/PostPreview.component'
import { PostPreviewSkeleton } from '../components/PostPreview.skeleton'
import { usePostsPageState } from '../usePostsPageState.hook'

const LATEST_POSTS_COUNT = 5

export function LatestPosts() {
  const state = usePostsPageState(1, LATEST_POSTS_COUNT)

  if (state.status === 'loading') {
    return (
      <div class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: LATEST_POSTS_COUNT }).map((_, index) => (
          <PostPreviewSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (state.status === 'error') {
    return <p class="text-red-600 dark:text-red-400">{state.message}</p>
  }

  if (state.page.items.length === 0) {
    return <p class="text-gray-600 dark:text-gray-300">No s'han trobat articles.</p>
  }

  return (
    <div class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.page.items.map((post) => (
        <PostPreview key={post.slug.toString()} post={post} />
      ))}
    </div>
  )
}
