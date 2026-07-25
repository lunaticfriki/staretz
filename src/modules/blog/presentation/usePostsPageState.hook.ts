import { useEffect } from 'preact/hooks'
import { container } from '../../../composition-root'
import { PaginationCriteria } from '../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import type { PostsPageState, PostStateService } from '../application/Post.stateService'
import { ListPostsQuery } from '../application/query/ListPosts.query'
import { TYPES } from '../../../shared/di/types'

export function usePostsPageState(page: number, perPage: number, search = ''): PostsPageState {
  const postStateService = container.get<PostStateService>(TYPES.PostStateService)

  useEffect(() => {
    postStateService.loadPosts(
      new ListPostsQuery(PaginationCriteria.create(page, perPage), SearchCriteria.create(search)),
    )
  }, [page, perPage, search])

  return postStateService.postsPage.value
}
