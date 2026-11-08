import { PostSlider } from '../components/PostSlider.component'
import { PostSliderSkeleton } from '../components/PostSlider.skeleton'
import { usePostsPageState } from '../usePostsPageState.hook'

const LATEST_POSTS_COUNT = 5

export function LatestPosts() {
  const state = usePostsPageState(1, LATEST_POSTS_COUNT)

  if (state.status === 'loading') {
    return (
      <PostSliderSkeleton count={LATEST_POSTS_COUNT} />
    )
  }

  if (state.status === 'error') {
    return <p class="text-red-600 dark:text-red-400">{state.message}</p>
  }

  if (state.page.items.length === 0) {
    return <p class="text-gray-600 dark:text-gray-300">No s'han trobat articles.</p>
  }

  return (
    <PostSlider posts={state.page.items} />
  )
}
