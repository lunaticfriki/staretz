import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import type { PostWriteService } from '../../../../blog/application/Post.writeService'
import { MissingPostImageError } from '../../../domain/errors/MissingPostImage.error'
import type { PostImageUploader } from '../../../domain/repositories/PostImageUploader.repository'
import { PublishPostCommand } from '../PublishPost.command'
import { PublishPostCommandHandler } from '../PublishPost.commandHandler'

function validCommand(overrides: Partial<{ imageFile: File | null }> = {}): PublishPostCommand {
  return new PublishPostCommand(
    'my-new-post',
    'My New Post',
    'A short excerpt.',
    'The post body.',
    'Vania',
    'Architecture',
    '2026-07-25',
    overrides.imageFile === undefined ? new File(['data'], 'cover.jpg') : overrides.imageFile,
  )
}

describe('PublishPostCommandHandler', () => {
  it('uploads the image and creates the post with the uploaded URL', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    when(imageUploader.upload(anything())).thenResolve('https://storage.example.com/cover.jpg')
    when(postWriteService.createPost(anything())).thenResolve()

    const handler = new PublishPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(validCommand())

    verify(postWriteService.createPost(anything())).once()
    const [command] = capture(postWriteService.createPost).last()
    expect(command.slug).toBe('my-new-post')
    expect(command.image).toBe('https://storage.example.com/cover.jpg')
  })

  it('rejects when no image file was provided, without uploading or creating anything', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()

    const handler = new PublishPostCommandHandler(instance(imageUploader), instance(postWriteService))

    await expect(handler.handle(validCommand({ imageFile: null }))).rejects.toThrow(MissingPostImageError)
    verify(imageUploader.upload(anything())).never()
    verify(postWriteService.createPost(anything())).never()
  })
})
