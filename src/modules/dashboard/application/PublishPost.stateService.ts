import { signal, type Signal } from '@preact/signals-core'
import type { ErrorManager } from '../../../shared/errors/application/ErrorManager.service'
import type { NotificationStateService } from '../../../shared/notifications/application/Notification.stateService'
import type { PublishPostCommand } from './command/PublishPost.command'
import type { PublishPostCommandHandler } from './command/PublishPost.commandHandler'

export type PublishPostState = { status: 'idle' } | { status: 'submitting' } | { status: 'submitted' }

export abstract class PublishPostStateService {
  abstract readonly state: Signal<PublishPostState>
  abstract publish(command: PublishPostCommand): Promise<void>
}

export class PublishPostStateServiceImpl extends PublishPostStateService {
  readonly state = signal<PublishPostState>({ status: 'idle' })

  constructor(
    private readonly publishPostHandler: PublishPostCommandHandler,
    private readonly notificationStateService: NotificationStateService,
    private readonly errorManager: ErrorManager,
  ) {
    super()
  }

  async publish(command: PublishPostCommand): Promise<void> {
    this.state.value = { status: 'submitting' }

    try {
      await this.publishPostHandler.handle(command)
      this.state.value = { status: 'submitted' }
      this.notificationStateService.notify('success', 'Article publicat correctament.')
    } catch (error) {
      this.state.value = { status: 'idle' }
      this.errorManager.handle(error as Error)
    }
  }
}
