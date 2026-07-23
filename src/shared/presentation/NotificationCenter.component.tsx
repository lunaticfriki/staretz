import type { Notification, NotificationKind } from '../notifications/domain/entities/Notification.entity'
import { useNotificationsState } from './useNotificationsState.hook'

const KIND_STYLES: Record<NotificationKind, string> = {
  info: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  warning:
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
}

export function NotificationCenter() {
  const { notifications, dismiss } = useNotificationsState()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div class="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id.toString()}
          notification={notification}
          onDismiss={() => dismiss(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationToastProps {
  notification: Notification
  onDismiss: () => void
}

function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  return (
    <div
      role="alert"
      class={`flex w-full max-w-sm items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${KIND_STYLES[notification.kind]}`}
    >
      <p>{notification.message.toString()}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        class="shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  )
}
