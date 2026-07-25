import { DomainError } from '../../../errors/domain/Domain.error'

export class InvalidPaginationCriteriaError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}

export class PaginationCriteria {
  private constructor(
    public readonly page: number,
    public readonly perPage: number,
  ) {}

  static create(page: number, perPage: number): PaginationCriteria {
    if (!Number.isInteger(page) || page < 1) {
      throw new InvalidPaginationCriteriaError(`page must be a positive integer, got ${page}`)
    }
    if (!Number.isInteger(perPage) || perPage < 1) {
      throw new InvalidPaginationCriteriaError(`perPage must be a positive integer, got ${perPage}`)
    }
    return new PaginationCriteria(page, perPage)
  }

  get offset(): number {
    return (this.page - 1) * this.perPage
  }

  withPage(page: number): PaginationCriteria {
    return PaginationCriteria.create(page, this.perPage)
  }

  equals(other: PaginationCriteria): boolean {
    return this.page === other.page && this.perPage === other.perPage
  }
}
