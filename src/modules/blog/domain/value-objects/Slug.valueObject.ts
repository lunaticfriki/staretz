import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidSlugError extends DomainError {
  constructor(value: string) {
    super(`"${value}" is not a valid slug`)
  }
}

export class Slug {
  private constructor(public readonly value: string) {}

  static create(value: string): Slug {
    if (!Slug.isValid(value)) {
      throw new InvalidSlugError(value)
    }
    return new Slug(value)
  }

  static empty(): Slug {
    return new Slug('')
  }

  private static isValid(value: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  }

  equals(other: Slug): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
