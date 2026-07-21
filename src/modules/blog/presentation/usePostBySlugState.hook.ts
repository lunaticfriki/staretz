import { useEffect } from 'preact/hooks'
import { container } from '../../../composition-root'
import type { PostBySlugState, PostStateService } from '../application/Post.stateService'
import { GetPostBySlugQuery } from '../application/query/GetPostBySlug.query'
import { TYPES } from '../../../shared/di/types'

export function usePostBySlugState(slug: string): PostBySlugState {
  const postStateService = container.get<PostStateService>(TYPES.PostStateService)

  useEffect(() => {
    postStateService.loadBySlug(new GetPostBySlugQuery(slug))
  }, [slug])

  return postStateService.postBySlug.value
}
