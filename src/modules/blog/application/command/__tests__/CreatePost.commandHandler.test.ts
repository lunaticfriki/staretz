import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import { InvalidCategoryError } from '../../../domain/value-objects/Category.valueObject'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { CreatePostCommand } from '../CreatePost.command'
import { CreatePostCommandHandler } from '../CreatePost.commandHandler'

function validCommand(
  overrides: Partial<Record<string, string>> = {},
  gallery: string[] = [],
): CreatePostCommand {
  const fields = {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'A short excerpt.',
    content: 'The post body.',
    author: 'Vania',
    category: 'Architecture',
    publishedAt: '2026-07-25',
    image: 'https://example.com/image.jpg',
    ...overrides,
  }
  return new CreatePostCommand(
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

describe('CreatePostCommandHandler', () => {
  it('builds a Post from the command and saves it through the repository', async () => {
    const repository = mock<PostRepository>()
    when(repository.save(anything())).thenResolve()

    const handler = new CreatePostCommandHandler(instance(repository))
    await handler.handle(validCommand())

    verify(repository.save(anything())).once()
    const [savedPost] = capture(repository.save).last()
    expect(savedPost.slug.toString()).toBe('my-new-post')
    expect(savedPost.title.toString()).toBe('My New Post')
    expect(savedPost.category.toString()).toBe('Architecture')
    expect(savedPost.image.toString()).toBe('https://example.com/image.jpg')
  })

  it('rejects an invalid field through the normal value-object validation', async () => {
    const repository = mock<PostRepository>()
    const handler = new CreatePostCommandHandler(instance(repository))

    await expect(handler.handle(validCommand({ category: '' }))).rejects.toThrow(InvalidCategoryError)
  })

  it('carries the gallery image URLs onto the saved post', async () => {
    const repository = mock<PostRepository>()
    when(repository.save(anything())).thenResolve()

    const handler = new CreatePostCommandHandler(instance(repository))
    await handler.handle(validCommand({}, ['https://example.com/one.jpg', 'https://example.com/two.jpg']))

    const [savedPost] = capture(repository.save).last()
    expect(savedPost.gallery.toArray()).toEqual(['https://example.com/one.jpg', 'https://example.com/two.jpg'])
  })
})
