import type { PaginationCriteria } from '../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import type { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { SortCriteria } from '../../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'
import type { PostSortField } from '../../domain/collections/Post.collection'

export class ListPostsQuery {
  constructor(
    readonly pagination: PaginationCriteria,
    readonly search: SearchCriteria,
    readonly sort: SortCriteria<PostSortField> = SortCriteria.none(),
  ) {}
}
