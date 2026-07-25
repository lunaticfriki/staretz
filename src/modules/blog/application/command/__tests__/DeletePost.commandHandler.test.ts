import { describe, expect, it } from 'vitest'
import { anything, capture, instance, mock, verify, when } from 'ts-mockito'
import { InvalidSlugError } from '../../../domain/value-objects/Slug.valueObject'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { DeletePostCommand } from '../DeletePost.command'
import { DeletePostCommandHandler } from '../DeletePost.commandHandler'

describe('DeletePostCommandHandler', () => {
  it('deletes the post identified by the command slug', async () => {
    const repository = mock<PostRepository>()
    when(repository.delete(anything())).thenResolve()

    const handler = new DeletePostCommandHandler(instance(repository))
    await handler.handle(new DeletePostCommand('my-existing-post'))

    verify(repository.delete(anything())).once()
    const [slug] = capture(repository.delete).last()
    expect(slug.toString()).toBe('my-existing-post')
  })

  it('rejects an invalid slug through the normal value-object validation', async () => {
    const repository = mock<PostRepository>()
    const handler = new DeletePostCommandHandler(instance(repository))

    await expect(handler.handle(new DeletePostCommand(''))).rejects.toThrow(InvalidSlugError)
  })
})
