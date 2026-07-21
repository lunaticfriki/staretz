import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostExcerptError extends DomainError {
  constructor() {
    super('Post excerpt cannot be empty')
  }
}

export class PostExcerpt {
  private constructor(public readonly value: string) {}

  static create(value: string): PostExcerpt {
    if (!value.trim()) {
      throw new InvalidPostExcerptError()
    }
    return new PostExcerpt(value.trim())
  }

  static empty(): PostExcerpt {
    return new PostExcerpt('')
  }

  toString(): string {
    return this.value
  }
}
