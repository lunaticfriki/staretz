import { container } from '../../composition-root'
import type { Notification } from '../notifications/domain/entities/Notification.entity'
import type { NotificationId } from '../notifications/domain/value-objects/NotificationId.valueObject'
import type { NotificationStateService } from '../notifications/application/Notification.stateService'
import { TYPES } from '../di/types'

interface NotificationsState {
  notifications: Notification[]
  dismiss: (id: NotificationId) => void
}

export function useNotificationsState(): NotificationsState {
  const notificationStateService = container.get<NotificationStateService>(TYPES.NotificationStateService)

  return {
    notifications: notificationStateService.notifications.value,
    dismiss: (id: NotificationId) => notificationStateService.dismiss(id),
  }
}
