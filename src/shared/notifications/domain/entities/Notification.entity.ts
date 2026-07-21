import { NotificationId } from '../value-objects/NotificationId.valueObject'
import { NotificationMessage } from '../value-objects/NotificationMessage.valueObject'

export type NotificationKind = 'info' | 'success' | 'warning' | 'error'

interface CreateNotificationParams {
  kind: NotificationKind
  message: NotificationMessage
}

export class Notification {
  private constructor(
    public readonly id: NotificationId,
    public readonly kind: NotificationKind,
    public readonly message: NotificationMessage,
  ) {}

  static create(params: CreateNotificationParams): Notification {
    return new Notification(NotificationId.generate(), params.kind, params.message)
  }

  static empty(): Notification {
    return new Notification(NotificationId.empty(), 'info', NotificationMessage.empty())
  }
}
