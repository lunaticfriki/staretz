import type { PaginationCriteria } from './PaginationCriteria.valueObject'

interface CreatePageParams<T> {
  items: T[]
  criteria: PaginationCriteria
  totalItems: number
}

export class Page<T> {
  private constructor(
    public readonly items: T[],
    public readonly page: number,
    public readonly perPage: number,
    public readonly totalItems: number,
  ) {}

  static create<T>({ items, criteria, totalItems }: CreatePageParams<T>): Page<T> {
    return new Page(items, criteria.page, criteria.perPage, totalItems)
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.perPage))
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages
  }

  get hasPreviousPage(): boolean {
    return this.page > 1
  }
}
