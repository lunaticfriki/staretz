import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import type { PostWriteService } from '../../../../blog/application/Post.writeService'
import type { PostImageUploader } from '../../../domain/repositories/PostImageUploader.repository'
import { EditPostCommand } from '../EditPost.command'
import { EditPostCommandHandler } from '../EditPost.commandHandler'

function commandWith(
  overrides: Partial<{
    imageFile: File | null
    keptGalleryUrls: string[]
    newGalleryFiles: File[]
    content: string
  }> = {},
): EditPostCommand {
  return new EditPostCommand(
    'my-existing-post',
    'My Updated Post',
    'An updated excerpt.',
    overrides.content ?? 'The updated post body.',
    'Vania',
    'Architecture',
    '2026-07-25',
    'https://storage.example.com/current.jpg',
    overrides.imageFile === undefined ? null : overrides.imageFile,
    overrides.keptGalleryUrls ?? [],
    overrides.newGalleryFiles ?? [],
  )
}

describe('EditPostCommandHandler', () => {
  it('reuses the current image and updates the post when no new file was selected', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    when(imageUploader.uploadMany(anything())).thenResolve([])
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
    when(imageUploader.uploadMany(anything())).thenResolve([])
    when(postWriteService.updatePost(anything())).thenResolve()

    const handler = new EditPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(commandWith({ imageFile: new File(['data'], 'cover.jpg') }))

    verify(imageUploader.upload(anything())).once()
    const [command] = capture(postWriteService.updatePost).last()
    expect(command.image).toBe('https://storage.example.com/new.jpg')
  })

  it('combines kept gallery URLs with newly uploaded gallery files', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    const newFile = new File(['data'], 'extra.jpg')
    when(imageUploader.uploadMany(anything())).thenResolve(['https://storage.example.com/extra.jpg'])
    when(postWriteService.updatePost(anything())).thenResolve()

    const handler = new EditPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(
      commandWith({
        keptGalleryUrls: ['https://storage.example.com/kept.jpg'],
        newGalleryFiles: [newFile],
      }),
    )

    const [uploadManyFiles] = capture(imageUploader.uploadMany).last()
    expect(uploadManyFiles).toEqual([newFile])
    const [command] = capture(postWriteService.updatePost).last()
    expect(command.gallery).toEqual(['https://storage.example.com/kept.jpg', 'https://storage.example.com/extra.jpg'])
  })

  it('resolves gallery:N placeholders in the content to the newly uploaded URLs', async () => {
    const imageUploader = mock<PostImageUploader>()
    const postWriteService = mock<PostWriteService>()
    const newFile = new File(['data'], 'extra.jpg')
    when(imageUploader.uploadMany(anything())).thenResolve(['https://storage.example.com/extra.jpg'])
    when(postWriteService.updatePost(anything())).thenResolve()

    const handler = new EditPostCommandHandler(instance(imageUploader), instance(postWriteService))
    await handler.handle(
      commandWith({
        content: 'Body with ![alt](gallery:0) inline.',
        newGalleryFiles: [newFile],
      }),
    )

    const [command] = capture(postWriteService.updatePost).last()
    expect(command.content).toBe('Body with ![alt](https://storage.example.com/extra.jpg) inline.')
  })
})
