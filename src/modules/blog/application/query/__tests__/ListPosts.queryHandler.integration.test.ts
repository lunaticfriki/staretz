import { describe, expect, it } from 'vitest'
import { PaginationCriteria } from '../../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { FakePostRepository } from '../../../infrastructure/FakePost.repository'
import { ListPostsQuery } from '../ListPosts.query'
import { ListPostsQueryHandler } from '../ListPosts.queryHandler'

describe('ListPostsQueryHandler (integration, real seed data)', () => {
  it('returns the first page ordered from most to least recent', async () => {
    const handler = new ListPostsQueryHandler(new FakePostRepository())

    const page = await handler.handle(new ListPostsQuery(PaginationCriteria.create(1, 5), SearchCriteria.empty()))

    expect(page.items).toHaveLength(5)
    const dates = page.items.map((post) => post.publishedAt.toDate().getTime())
    const sorted = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(sorted)
    expect(page.items[0].title.toString()).toBe('Shipping Fast Without Breaking Architecture')
  })

  it('paginates across the full set of seeded posts without gaps or overlap', async () => {
    const handler = new ListPostsQueryHandler(new FakePostRepository())

    const firstPage = await handler.handle(
      new ListPostsQuery(PaginationCriteria.create(1, 5), SearchCriteria.empty()),
    )
    const totalPages = firstPage.totalPages

    const seenSlugs = new Set<string>()
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const page = await handler.handle(
        new ListPostsQuery(PaginationCriteria.create(pageNumber, 5), SearchCriteria.empty()),
      )
      for (const post of page.items) {
        seenSlugs.add(post.slug.toString())
      }
    }

    expect(seenSlugs.size).toBe(firstPage.totalItems)
  })

  it('filters the real seed data down to posts in a given category', async () => {
    const handler = new ListPostsQueryHandler(new FakePostRepository())

    const page = await handler.handle(
      new ListPostsQuery(PaginationCriteria.create(1, 20), SearchCriteria.create('Architecture')),
    )

    expect(page.totalItems).toBe(5)
    expect(page.items.every((post) => post.category.toString() === 'Architecture')).toBe(true)
  })
})
