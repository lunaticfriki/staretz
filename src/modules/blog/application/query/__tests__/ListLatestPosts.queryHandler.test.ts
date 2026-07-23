import { describe, expect, it } from 'vitest'
import { instance, mock, when } from 'ts-mockito'
import { PostCollection } from '../../../domain/collections/Post.collection'
import { PostMother } from '../../../domain/entities/__tests__/Post.mother'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { ListLatestPostsQuery } from '../ListLatestPosts.query'
import { ListLatestPostsQueryHandler } from '../ListLatestPosts.queryHandler'

describe('ListLatestPostsQueryHandler', () => {
  it('returns posts ordered by most recent first, limited to the requested count', async () => {
    const repository = mock<PostRepository>()
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const middle = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    when(repository.findAll()).thenResolve(PostCollection.create([oldest, middle, newest]))

    const handler = new ListLatestPostsQueryHandler(instance(repository))
    const result = (await handler.handle(new ListLatestPostsQuery(2))).toArray()

    expect(result).toHaveLength(2)
    expect(result[0]).toBe(newest)
    expect(result[1]).toBe(middle)
  })
})
