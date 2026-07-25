import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostImageError extends DomainError {
  constructor() {
    super('Post image URL cannot be empty')
  }
}

export class PostImage {
  private constructor(public readonly url: string) {}

  static create(url: string): PostImage {
    if (!url.trim()) {
      throw new InvalidPostImageError()
    }
    return new PostImage(url.trim())
  }

  static empty(): PostImage {
    return new PostImage('')
  }

  toString(): string {
    return this.url
  }
}
