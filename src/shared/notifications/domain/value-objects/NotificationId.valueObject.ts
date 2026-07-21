import { DomainError } from '../../../errors/domain/Domain.error'

export class InvalidNotificationIdError extends DomainError {
  constructor() {
    super('Notification id cannot be empty')
  }
}

export class NotificationId {
  private constructor(public readonly value: string) {}

  static create(value: string): NotificationId {
    if (!value.trim()) {
      throw new InvalidNotificationIdError()
    }
    return new NotificationId(value)
  }

  static generate(): NotificationId {
    return new NotificationId(crypto.randomUUID())
  }

  static empty(): NotificationId {
    return new NotificationId('')
  }

  equals(other: NotificationId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
