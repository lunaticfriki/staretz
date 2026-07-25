import { describe, expect, it } from 'vitest'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import type { ErrorManager } from '../../../../shared/errors/application/ErrorManager.service'
import type { NotificationStateService } from '../../../../shared/notifications/application/Notification.stateService'
import { PublishPostCommand } from '../command/PublishPost.command'
import type { PublishPostCommandHandler } from '../command/PublishPost.commandHandler'
import { PublishPostStateServiceImpl } from '../PublishPost.stateService'

const command = new PublishPostCommand(
  'my-new-post',
  'My New Post',
  'A short excerpt.',
  'The post body.',
  'Vania',
  'Architecture',
  '2026-07-25',
  new File(['data'], 'cover.jpg'),
)

describe('PublishPostStateServiceImpl', () => {
  it('goes through submitting to submitted and notifies success on a successful publish', async () => {
    const handler = mock<PublishPostCommandHandler>()
    const notifications = mock<NotificationStateService>()
    const errorManager = mock<ErrorManager>()
    when(handler.handle(anything())).thenResolve()

    const service = new PublishPostStateServiceImpl(instance(handler), instance(notifications), instance(errorManager))
    const publishing = service.publish(command)
    expect(service.state.value).toEqual({ status: 'submitting' })
    await publishing

    expect(service.state.value).toEqual({ status: 'submitted' })
    verify(notifications.notify('success', 'Article publicat correctament.')).once()
    verify(errorManager.handle(anything())).never()
  })

  it('resets to idle and reports the error through ErrorManager on failure', async () => {
    const handler = mock<PublishPostCommandHandler>()
    const notifications = mock<NotificationStateService>()
    const errorManager = mock<ErrorManager>()
    const error = new Error('upload failed')
    when(handler.handle(anything())).thenReject(error)

    const service = new PublishPostStateServiceImpl(instance(handler), instance(notifications), instance(errorManager))
    await service.publish(command)

    expect(service.state.value).toEqual({ status: 'idle' })
    verify(errorManager.handle(error)).once()
    verify(notifications.notify('success', anything())).never()
  })
})
