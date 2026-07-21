import { describe, expect, it } from 'vitest'
import { instance, mock, when } from 'ts-mockito'
import { Notification } from '../../domain/entities/Notification.entity'
import { NotificationMessage } from '../../domain/value-objects/NotificationMessage.valueObject'
import type { NotificationService } from '../NotificationService.service'
import { NotificationStateServiceImpl } from '../Notification.stateService'

describe('NotificationStateServiceImpl', () => {
  it('appends a notification created by the notification service', () => {
    const notificationService = mock<NotificationService>()
    const notification = Notification.create({
      kind: 'success',
      message: NotificationMessage.create('Saved'),
    })
    when(notificationService.create('success', 'Saved')).thenReturn(notification)

    const stateService = new NotificationStateServiceImpl(instance(notificationService))
    stateService.notify('success', 'Saved')

    expect(stateService.notifications.value).toEqual([notification])
  })

  it('dismisses a notification by id', () => {
    const notificationService = mock<NotificationService>()
    const notification = Notification.create({
      kind: 'info',
      message: NotificationMessage.create('Heads up'),
    })
    when(notificationService.create('info', 'Heads up')).thenReturn(notification)

    const stateService = new NotificationStateServiceImpl(instance(notificationService))
    stateService.notify('info', 'Heads up')
    stateService.dismiss(notification.id)

    expect(stateService.notifications.value).toEqual([])
  })
})
