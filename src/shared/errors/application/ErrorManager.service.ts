import { DomainWarning } from '../domain/Domain.warning'
import type { NotificationStateService } from '../../notifications/application/Notification.stateService'

export abstract class ErrorManager {
  abstract handle(error: Error): void
}

export class ErrorManagerImpl extends ErrorManager {
  constructor(private readonly notificationStateService: NotificationStateService) {
    super()
  }

  handle(error: Error): void {
    const kind = error instanceof DomainWarning ? 'warning' : 'error'
    this.notificationStateService.notify(kind, error.message)
  }
}
