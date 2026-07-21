import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class PostNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Post with slug "${slug}" not found`)
  }
}
