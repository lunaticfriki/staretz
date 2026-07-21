import { useEffect } from 'preact/hooks'
import { container } from '../../../composition-root'
import type { LatestPostsState, PostStateService } from '../application/Post.stateService'
import { ListLatestPostsQuery } from '../application/query/ListLatestPosts.query'
import { TYPES } from '../../../shared/di/types'

export function useRecentPostsState(limit: number): LatestPostsState {
  const postStateService = container.get<PostStateService>(TYPES.PostStateService)

  useEffect(() => {
    postStateService.loadLatest(new ListLatestPostsQuery(limit))
  }, [limit])

  return postStateService.latestPosts.value
}
