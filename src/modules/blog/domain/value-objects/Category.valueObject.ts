import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidCategoryError extends DomainError {
  constructor() {
    super('Category cannot be empty')
  }
}

export class Category {
  private constructor(public readonly value: string) {}

  static create(value: string): Category {
    if (!value.trim()) {
      throw new InvalidCategoryError()
    }
    return new Category(value.trim())
  }

  static empty(): Category {
    return new Category('')
  }

  equals(other: Category): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase()
  }

  toString(): string {
    return this.value
  }
}
