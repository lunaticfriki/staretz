import { DomainError } from '../../../errors/domain/Domain.error'

export class InvalidNotificationMessageError extends DomainError {
  constructor() {
    super('Notification message cannot be empty')
  }
}

export class NotificationMessage {
  private constructor(public readonly value: string) {}

  static create(value: string): NotificationMessage {
    if (!value.trim()) {
      throw new InvalidNotificationMessageError()
    }
    return new NotificationMessage(value.trim())
  }

  static empty(): NotificationMessage {
    return new NotificationMessage('')
  }

  toString(): string {
    return this.value
  }
}
