import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import type { PostWriteService } from '../../../../blog/application/Post.writeService'
import type { PostImageUploader } from '../../../domain/repositories/PostImageUploader.repository'
import { EditPostCommand } from '../EditPost.command'
import { EditPostCommandHandler } from '../EditPost.commandHandler'

function commandWith(overrides: Partial<{ imageFile: File | null }> = {}): EditPostCommand {
  return new EditPostCommand(
    'my-existing-post',
    'My Updated Post',
    'An updated excerpt.',
    'The updated post body.',
    'Vania',
    'Architecture',
    '2026-07-25',
    'https://storage.example.com/current.jpg',
    overrides.imageFile === undefined ? null : overrides.imageFile,
  )
}

describe('EditPostCommandHandler', () => {
  it('reuses the current image and updates the post when no new file was selected', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    when(postWriteService.updatePost(anything())).thenResolve()

    const handler = new EditPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(commandWith())

    verify(imageUploader.upload(anything())).never()
    verify(postWriteService.updatePost(anything())).once()
    const [command] = capture(postWriteService.updatePost).last()
    expect(command.image).toBe('https://storage.example.com/current.jpg')
  })

  it('uploads a new image and uses its URL when a new file was selected', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    when(imageUploader.upload(anything())).thenResolve('https://storage.example.com/new.jpg')
    when(postWriteService.updatePost(anything())).thenResolve()

    const handler = new EditPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(commandWith({ imageFile: new File(['data'], 'cover.jpg') }))

    verify(imageUploader.upload(anything())).once()
    const [command] = capture(postWriteService.updatePost).last()
    expect(command.image).toBe('https://storage.example.com/new.jpg')
  })
})
