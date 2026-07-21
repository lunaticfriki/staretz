import { Notification, type NotificationKind } from '../Notification.entity'
import { NotificationMessage } from '../../value-objects/NotificationMessage.valueObject'

export class NotificationMother {
  static random(): Notification {
    return Notification.create({
      kind: 'info',
      message: NotificationMessage.create('Sample notification'),
    })
  }

  static empty(): Notification {
    return Notification.empty()
  }

  static ofKind(kind: NotificationKind): Notification {
    return Notification.create({
      kind,
      message: NotificationMessage.create('Sample notification'),
    })
  }
}
