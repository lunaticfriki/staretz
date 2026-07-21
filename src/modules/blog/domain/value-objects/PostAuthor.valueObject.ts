import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostAuthorError extends DomainError {
  constructor() {
    super('Post author cannot be empty')
  }
}

export class PostAuthor {
  private constructor(public readonly value: string) {}

  static create(value: string): PostAuthor {
    if (!value.trim()) {
      throw new InvalidPostAuthorError()
    }
    return new PostAuthor(value.trim())
  }

  static empty(): PostAuthor {
    return new PostAuthor('')
  }

  toString(): string {
    return this.value
  }
}
