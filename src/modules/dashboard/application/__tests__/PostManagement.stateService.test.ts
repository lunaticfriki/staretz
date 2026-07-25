import { describe, expect, it } from 'vitest'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import type { ErrorManager } from '../../../../shared/errors/application/ErrorManager.service'
import type { NotificationStateService } from '../../../../shared/notifications/application/Notification.stateService'
import { EditPostCommand } from '../command/EditPost.command'
import type { EditPostCommandHandler } from '../command/EditPost.commandHandler'
import { PublishPostCommand } from '../command/PublishPost.command'
import type { PublishPostCommandHandler } from '../command/PublishPost.commandHandler'
import { PostManagementStateServiceImpl } from '../PostManagement.stateService'

const publishCommand = new PublishPostCommand(
  'my-new-post',
  'My New Post',
  'A short excerpt.',
  'The post body.',
  'Vania',
  'Architecture',
  '2026-07-25',
  new File(['data'], 'cover.jpg'),
)

const editCommand = new EditPostCommand(
  'my-existing-post',
  'My Updated Post',
  'An updated excerpt.',
  'The updated post body.',
  'Vania',
  'Architecture',
  '2026-07-25',
  'https://storage.example.com/current.jpg',
  null,
)

function setup() {
  const publishHandler = mock<PublishPostCommandHandler>()
  const editHandler = mock<EditPostCommandHandler>()
  const postWriteService = mock<PostWriteService>()
  const notifications = mock<NotificationStateService>()
  const errorManager = mock<ErrorManager>()

  const service = new PostManagementStateServiceImpl(
    instance(publishHandler),
    instance(editHandler),
    instance(postWriteService),
    instance(notifications),
    instance(errorManager),
  )

  return { publishHandler, editHandler, postWriteService, notifications, errorManager, service }
}

describe('PostManagementStateServiceImpl', () => {
  it('publishPost() goes through submitting to submitted and notifies success', async () => {
    const { publishHandler, notifications, errorManager, service } = setup()
    when(publishHandler.handle(anything())).thenResolve()

    const publishing = service.publishPost(publishCommand)
    expect(service.publish.value).toEqual({ status: 'submitting' })
    await publishing

    expect(service.publish.value).toEqual({ status: 'submitted' })
    verify(notifications.notify('success', anything())).once()
    verify(errorManager.handle(anything())).never()
  })

  it('publishPost() resets to idle and reports the error on failure', async () => {
    const { publishHandler, errorManager, service } = setup()
    const error = new Error('upload failed')
    when(publishHandler.handle(anything())).thenReject(error)

    await service.publishPost(publishCommand)

    expect(service.publish.value).toEqual({ status: 'idle' })
    verify(errorManager.handle(error)).once()
  })

  it('editPost() goes through submitting to submitted and notifies success', async () => {
    const { editHandler, notifications, service } = setup()
    when(editHandler.handle(anything())).thenResolve()

    const editing = service.editPost(editCommand)
    expect(service.edit.value).toEqual({ status: 'submitting' })
    await editing

    expect(service.edit.value).toEqual({ status: 'submitted' })
    verify(notifications.notify('success', anything())).once()
  })

  it('editPost() resets to idle and reports the error on failure', async () => {
    const { editHandler, errorManager, service } = setup()
    const error = new Error('update failed')
    when(editHandler.handle(anything())).thenReject(error)

    await service.editPost(editCommand)

    expect(service.edit.value).toEqual({ status: 'idle' })
    verify(errorManager.handle(error)).once()
  })

  it('deletePost() tracks the deleting slug and settles to deleted, notifying success', async () => {
    const { postWriteService, notifications, service } = setup()
    when(postWriteService.deletePost(anything())).thenResolve()

    const deleting = service.deletePost('my-existing-post')
    expect(service.delete.value).toEqual({ status: 'deleting', slug: 'my-existing-post' })
    await deleting

    expect(service.delete.value).toEqual({ status: 'deleted', slug: 'my-existing-post' })
    verify(notifications.notify('success', anything())).once()
  })

  it('deletePost() resets to idle and reports the error on failure', async () => {
    const { postWriteService, errorManager, service } = setup()
    const error = new Error('delete failed')
    when(postWriteService.deletePost(anything())).thenReject(error)

    await service.deletePost('my-existing-post')

    expect(service.delete.value).toEqual({ status: 'idle' })
    verify(errorManager.handle(error)).once()
  })
})
