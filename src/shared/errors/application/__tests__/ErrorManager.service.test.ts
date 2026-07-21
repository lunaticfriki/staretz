import { describe, it } from 'vitest'
import { instance, mock, verify } from 'ts-mockito'
import { DomainWarning } from '../../domain/Domain.warning'
import type { NotificationStateService } from '../../../notifications/application/Notification.stateService'
import { ErrorManagerImpl } from '../ErrorManager.service'

class SampleWarning extends DomainWarning {
  constructor() {
    super('sample warning')
  }
}

describe('ErrorManagerImpl', () => {
  it('reports a DomainWarning as a warning notification', () => {
    const notificationStateService = mock<NotificationStateService>()
    const errorManager = new ErrorManagerImpl(instance(notificationStateService))

    errorManager.handle(new SampleWarning())

    verify(notificationStateService.notify('warning', 'sample warning')).once()
  })

  it('reports any other error as an error notification', () => {
    const notificationStateService = mock<NotificationStateService>()
    const errorManager = new ErrorManagerImpl(instance(notificationStateService))

    errorManager.handle(new Error('boom'))

    verify(notificationStateService.notify('error', 'boom')).once()
  })
})
