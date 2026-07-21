import { DomainError } from '../../../../shared/errors/domain/Domain.error'

export class InvalidPublishedAtError extends DomainError {
  constructor(value: unknown) {
    super(`"${String(value)}" is not a valid published date`)
  }
}

export class PublishedAt {
  private constructor(public readonly value: Date) {}

  static create(value: Date | string): PublishedAt {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
      throw new InvalidPublishedAtError(value)
    }
    return new PublishedAt(date)
  }

  static empty(): PublishedAt {
    return new PublishedAt(new Date(0))
  }

  isAfter(other: PublishedAt): boolean {
    return this.value.getTime() > other.value.getTime()
  }

  toDate(): Date {
    return new Date(this.value.getTime())
  }

  toISOString(): string {
    return this.value.toISOString()
  }
}
