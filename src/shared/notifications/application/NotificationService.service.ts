import { Notification, type NotificationKind } from '../domain/entities/Notification.entity'
import { NotificationMessage } from '../domain/value-objects/NotificationMessage.valueObject'

export abstract class NotificationService {
  abstract create(kind: NotificationKind, message: string): Notification
}

export class NotificationServiceImpl extends NotificationService {
  create(kind: NotificationKind, message: string): Notification {
    return Notification.create({ kind, message: NotificationMessage.create(message) })
  }
}
