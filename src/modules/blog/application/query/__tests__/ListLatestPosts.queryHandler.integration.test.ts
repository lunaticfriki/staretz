import { describe, expect, it } from 'vitest'
import { FakePostRepository } from '../../../infrastructure/FakePost.repository'
import { ListLatestPostsQuery } from '../ListLatestPosts.query'
import { ListLatestPostsQueryHandler } from '../ListLatestPosts.queryHandler'

describe('ListLatestPostsQueryHandler (integration, real seed data)', () => {
  it('returns exactly 5 posts ordered from most to least recent', async () => {
    const handler = new ListLatestPostsQueryHandler(new FakePostRepository())

    const result = (await handler.handle(new ListLatestPostsQuery(5))).toArray()

    expect(result).toHaveLength(5)
    const dates = result.map((post) => post.publishedAt.toDate().getTime())
    const sorted = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(sorted)
    expect(result[0].title.toString()).toBe('Shipping Fast Without Breaking Architecture')
  })
})
