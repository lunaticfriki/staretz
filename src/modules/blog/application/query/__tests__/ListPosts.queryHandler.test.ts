import { describe, expect, it } from 'vitest'
import { instance, mock, when } from 'ts-mockito'
import { PaginationCriteria } from '../../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { SortCriteria } from '../../../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'
import { PostCollection, type PostSortField } from '../../../domain/collections/Post.collection'
import { PostMother } from '../../../domain/entities/__tests__/Post.mother'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { ListPostsQuery } from '../ListPosts.query'
import { ListPostsQueryHandler } from '../ListPosts.queryHandler'

describe('ListPostsQueryHandler', () => {
  it('returns a page of posts ordered by most recent first', async () => {
    const repository = mock<PostRepository>()
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const middle = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    when(repository.findAll()).thenResolve(PostCollection.create([oldest, middle, newest]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(new ListPostsQuery(PaginationCriteria.create(1, 2), SearchCriteria.empty()))

    expect(page.items).toHaveLength(2)
    expect(page.items[0]).toBe(newest)
    expect(page.items[1]).toBe(middle)
    expect(page.totalItems).toBe(3)
    expect(page.totalPages).toBe(2)
  })

  it('returns the remainder on the last page', async () => {
    const repository = mock<PostRepository>()
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const middle = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    when(repository.findAll()).thenResolve(PostCollection.create([oldest, middle, newest]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(new ListPostsQuery(PaginationCriteria.create(2, 2), SearchCriteria.empty()))

    expect(page.items).toHaveLength(1)
    expect(page.items[0]).toBe(oldest)
  })

  it('filters by category before paginating', async () => {
    const repository = mock<PostRepository>()
    const architecture = PostMother.category('Architecture')
    const testing = PostMother.category('Testing')
    when(repository.findAll()).thenResolve(PostCollection.create([architecture, testing]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(
      new ListPostsQuery(PaginationCriteria.create(1, 5), SearchCriteria.create('arch')),
    )

    expect(page.items).toEqual([architecture])
    expect(page.totalItems).toBe(1)
  })

  it('also matches by title, not just category', async () => {
    const repository = mock<PostRepository>()
    const gould = PostMother.titled('Glenn Gould')
    const other = PostMother.titled('Something Else')
    when(repository.findAll()).thenResolve(PostCollection.create([gould, other]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(
      new ListPostsQuery(PaginationCriteria.create(1, 5), SearchCriteria.create('gould')),
    )

    expect(page.items).toEqual([gould])
  })

  it('defaults to most-recent-first when no sort criteria is given', async () => {
    const repository = mock<PostRepository>()
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    when(repository.findAll()).thenResolve(PostCollection.create([oldest, newest]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(new ListPostsQuery(PaginationCriteria.create(1, 5), SearchCriteria.empty()))

    expect(page.items).toEqual([newest, oldest])
  })

  it('sorts by the given field and direction when a sort criteria is provided', async () => {
    const repository = mock<PostRepository>()
    const banana = PostMother.titled('Banana')
    const apple = PostMother.titled('Apple')
    when(repository.findAll()).thenResolve(PostCollection.create([banana, apple]))

    const handler = new ListPostsQueryHandler(instance(repository))
    const page = await handler.handle(
      new ListPostsQuery(
        PaginationCriteria.create(1, 5),
        SearchCriteria.empty(),
        SortCriteria.create<PostSortField>('title', 'asc'),
      ),
    )

    expect(page.items).toEqual([apple, banana])
  })
})
