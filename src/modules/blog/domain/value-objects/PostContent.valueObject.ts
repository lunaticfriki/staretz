import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostContentError extends DomainError {
  constructor() {
    super('Post content cannot be empty')
  }
}

export class PostContent {
  private constructor(public readonly value: string) {}

  static create(value: string): PostContent {
    if (!value.trim()) {
      throw new InvalidPostContentError()
    }
    return new PostContent(value)
  }

  static empty(): PostContent {
    return new PostContent('')
  }

  toString(): string {
    return this.value
  }
}
