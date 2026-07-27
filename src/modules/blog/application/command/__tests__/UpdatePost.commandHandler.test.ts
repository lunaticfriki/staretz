import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import { InvalidCategoryError } from '../../../domain/value-objects/Category.valueObject'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { UpdatePostCommand } from '../UpdatePost.command'
import { UpdatePostCommandHandler } from '../UpdatePost.commandHandler'

function validCommand(
  overrides: Partial<Record<string, string>> = {},
  gallery: string[] = [],
): UpdatePostCommand {
  const fields = {
    slug: 'my-existing-post',
    title: 'My Updated Post',
    excerpt: 'An updated excerpt.',
    content: 'The updated post body.',
    author: 'Vania',
    category: 'Architecture',
    publishedAt: '2026-07-25',
    image: 'https://example.com/image.jpg',
    ...overrides,
  }
  return new UpdatePostCommand(
    fields.slug,
    fields.title,
    fields.excerpt,
    fields.content,
    fields.author,
    fields.category,
    fields.publishedAt,
    fields.image,
    gallery,
  )
}

describe('UpdatePostCommandHandler', () => {
  it('builds a Post from the command and updates it through the repository', async () => {
    const repository = mock<PostRepository>()
    when(repository.update(anything())).thenResolve()

    const handler = new UpdatePostCommandHandler(instance(repository))
    await handler.handle(validCommand())

    verify(repository.update(anything())).once()
    const [updatedPost] = capture(repository.update).last()
    expect(updatedPost.slug.toString()).toBe('my-existing-post')
    expect(updatedPost.title.toString()).toBe('My Updated Post')
    expect(updatedPost.image.toString()).toBe('https://example.com/image.jpg')
  })

  it('rejects an invalid field through the normal value-object validation', async () => {
    const repository = mock<PostRepository>()
    const handler = new UpdatePostCommandHandler(instance(repository))

    await expect(handler.handle(validCommand({ category: '' }))).rejects.toThrow(InvalidCategoryError)
  })

  it('carries the gallery image URLs onto the updated post', async () => {
    const repository = mock<PostRepository>()
    when(repository.update(anything())).thenResolve()

    const handler = new UpdatePostCommandHandler(instance(repository))
    await handler.handle(validCommand({}, ['https://example.com/one.jpg']))

    const [updatedPost] = capture(repository.update).last()
    expect(updatedPost.gallery.toArray()).toEqual(['https://example.com/one.jpg'])
  })
})
