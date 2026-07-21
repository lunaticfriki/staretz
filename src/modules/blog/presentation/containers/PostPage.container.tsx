import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { PostNotFound } from '../components/PostNotFound.component'
import { PostView } from '../components/PostView.component'
import { PostViewSkeleton } from '../components/PostView.skeleton'
import { usePostBySlugState } from '../usePostBySlugState.hook'

interface PostPageContainerProps extends RouteProps {
  slug?: string
}

export function PostPageContainer({ slug = '' }: PostPageContainerProps) {
  const state = usePostBySlugState(slug)

  if (state.status === 'loading') {
    return <PostViewSkeleton />
  }

  if (state.status === 'not-found') {
    return <PostNotFound />
  }

  return <PostView post={state.post} />
}
