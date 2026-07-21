import { signal, type Signal } from '@preact/signals-core'
import { Notification, type NotificationKind } from '../domain/entities/Notification.entity'
import type { NotificationId } from '../domain/value-objects/NotificationId.valueObject'
import type { NotificationService } from './NotificationService.service'

export abstract class NotificationStateService {
  abstract readonly notifications: Signal<Notification[]>
  abstract notify(kind: NotificationKind, message: string): void
  abstract dismiss(id: NotificationId): void
}

export class NotificationStateServiceImpl extends NotificationStateService {
  readonly notifications = signal<Notification[]>([])

  constructor(private readonly notificationService: NotificationService) {
    super()
  }

  notify(kind: NotificationKind, message: string): void {
    const notification = this.notificationService.create(kind, message)
    this.notifications.value = [...this.notifications.value, notification]
  }

  dismiss(id: NotificationId): void {
    this.notifications.value = this.notifications.value.filter(
      (notification) => !notification.id.equals(id),
    )
  }
}
