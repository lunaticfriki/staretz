import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPostGalleryError extends DomainError {
  constructor() {
    super('Post gallery image URL cannot be empty')
  }
}

export class PostGallery {
  private constructor(private readonly urls: readonly string[]) {}

  static create(urls: string[]): PostGallery {
    const trimmed = urls.map((url) => url.trim())
    if (trimmed.some((url) => !url)) {
      throw new InvalidPostGalleryError()
    }
    return new PostGallery(trimmed)
  }

  static empty(): PostGallery {
    return new PostGallery([])
  }

  toArray(): string[] {
    return [...this.urls]
  }
}
