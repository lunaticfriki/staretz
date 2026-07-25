import type { PaginationCriteria } from '../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import type { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'

export class ListPostsQuery {
  constructor(
    readonly pagination: PaginationCriteria,
    readonly search: SearchCriteria,
  ) {}
}
