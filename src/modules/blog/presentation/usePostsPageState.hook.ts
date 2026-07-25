import { useEffect } from 'preact/hooks'
import { container } from '../../../composition-root'
import { PaginationCriteria } from '../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { SortCriteria } from '../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'
import type { PostSortField } from '../domain/collections/Post.collection'
import type { PostsPageState, PostStateService } from '../application/Post.stateService'
import { ListPostsQuery } from '../application/query/ListPosts.query'
import { TYPES } from '../../../shared/di/types'

const DEFAULT_SORT = SortCriteria.none<PostSortField>()

export function usePostsPageState(
  page: number,
  perPage: number,
  search = '',
  sort: SortCriteria<PostSortField> = DEFAULT_SORT,
  refreshToken = 0,
): PostsPageState {
  const postStateService = container.get<PostStateService>(TYPES.PostStateService)

  useEffect(() => {
    postStateService.loadPosts(
      new ListPostsQuery(PaginationCriteria.create(page, perPage), SearchCriteria.create(search), sort),
    )
  }, [page, perPage, search, sort, refreshToken])

  return postStateService.postsPage.value
}
