import { signal, type Signal } from '@preact/signals-core'
import { DeletePostCommand } from '../../blog/application/command/DeletePost.command'
import type { PostWriteService } from '../../blog/application/Post.writeService'
import type { ErrorManager } from '../../../shared/errors/application/ErrorManager.service'
import type { NotificationStateService } from '../../../shared/notifications/application/Notification.stateService'
import type { EditPostCommand } from './command/EditPost.command'
import type { EditPostCommandHandler } from './command/EditPost.commandHandler'
import type { PublishPostCommand } from './command/PublishPost.command'
import type { PublishPostCommandHandler } from './command/PublishPost.commandHandler'

export type PublishPostState = { status: 'idle' } | { status: 'submitting' } | { status: 'submitted' }
export type EditPostState = { status: 'idle' } | { status: 'submitting' } | { status: 'submitted' }
export type DeletePostState =
  | { status: 'idle' }
  | { status: 'deleting'; slug: string }
  | { status: 'deleted'; slug: string }

export abstract class PostManagementStateService {
  abstract readonly publish: Signal<PublishPostState>
  abstract readonly edit: Signal<EditPostState>
  abstract readonly delete: Signal<DeletePostState>
  abstract publishPost(command: PublishPostCommand): Promise<void>
  abstract editPost(command: EditPostCommand): Promise<void>
  abstract deletePost(slug: string): Promise<void>
}

export class PostManagementStateServiceImpl extends PostManagementStateService {
  readonly publish = signal<PublishPostState>({ status: 'idle' })
  readonly edit = signal<EditPostState>({ status: 'idle' })
  readonly delete = signal<DeletePostState>({ status: 'idle' })

  constructor(
    private readonly publishPostHandler: PublishPostCommandHandler,
    private readonly editPostHandler: EditPostCommandHandler,
    private readonly postWriteService: PostWriteService,
    private readonly notificationStateService: NotificationStateService,
    private readonly errorManager: ErrorManager,
  ) {
    super()
  }

  async publishPost(command: PublishPostCommand): Promise<void> {
    this.publish.value = { status: 'submitting' }

    try {
      await this.publishPostHandler.handle(command)
      this.publish.value = { status: 'submitted' }
      this.notificationStateService.notify('success', 'Article publicat correctament.')
    } catch (error) {
      this.publish.value = { status: 'idle' }
      this.errorManager.handle(error as Error)
    }
  }

  async editPost(command: EditPostCommand): Promise<void> {
    this.edit.value = { status: 'submitting' }

    try {
      await this.editPostHandler.handle(command)
      this.edit.value = { status: 'submitted' }
      this.notificationStateService.notify('success', 'Article actualitzat correctament.')
    } catch (error) {
      this.edit.value = { status: 'idle' }
      this.errorManager.handle(error as Error)
    }
  }

  async deletePost(slug: string): Promise<void> {
    this.delete.value = { status: 'deleting', slug }

    try {
      await this.postWriteService.deletePost(new DeletePostCommand(slug))
      this.delete.value = { status: 'deleted', slug }
      this.notificationStateService.notify('success', 'Article eliminat correctament.')
    } catch (error) {
      this.delete.value = { status: 'idle' }
      this.errorManager.handle(error as Error)
    }
  }
}
