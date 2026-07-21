import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostTitleError extends DomainError {
  constructor() {
    super('Post title cannot be empty')
  }
}

export class PostTitle {
  private constructor(public readonly value: string) {}

  static create(value: string): PostTitle {
    if (!value.trim()) {
      throw new InvalidPostTitleError()
    }
    return new PostTitle(value.trim())
  }

  static empty(): PostTitle {
    return new PostTitle('')
  }

  toString(): string {
    return this.value
  }
}
