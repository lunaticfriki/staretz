import { describe, expect, it } from 'vitest'
import { PaginationCriteria } from '../../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { PostMother } from '../../entities/__tests__/Post.mother'
import { PostCollection } from '../Post.collection'

describe('PostCollection', () => {
  it('exposes its length', () => {
    const collection = PostCollection.create([PostMother.random(), PostMother.random()])

    expect(collection.length).toBe(2)
  })

  it('sortedByMostRecent() orders posts from newest to oldest', () => {
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    const middle = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))
    const collection = PostCollection.create([oldest, newest, middle])

    const sorted = collection.sortedByMostRecent().toArray()

    expect(sorted).toEqual([newest, middle, oldest])
  })

  it('paginate() slices the collection according to the criteria', () => {
    const posts = [PostMother.random(), PostMother.random(), PostMother.random()]
    const collection = PostCollection.create(posts)

    const page = collection.paginate(PaginationCriteria.create(2, 2))

    expect(page.items).toEqual([posts[2]])
    expect(page.totalItems).toBe(3)
    expect(page.totalPages).toBe(2)
  })

  it('filterByCategory() keeps only posts whose category matches the criteria', () => {
    const architecture = PostMother.category('Architecture')
    const testing = PostMother.category('Testing')
    const collection = PostCollection.create([architecture, testing])

    const filtered = collection.filterByCategory(SearchCriteria.create('arch'))

    expect(filtered.toArray()).toEqual([architecture])
  })

  it('filterByCategory() keeps everything when the criteria is empty', () => {
    const architecture = PostMother.category('Architecture')
    const testing = PostMother.category('Testing')
    const collection = PostCollection.create([architecture, testing])

    const filtered = collection.filterByCategory(SearchCriteria.empty())

    expect(filtered.length).toBe(2)
  })

  it('categories() returns the distinct categories sorted alphabetically', () => {
    const collection = PostCollection.create([
      PostMother.category('Testing'),
      PostMother.category('Architecture'),
      PostMother.category('Testing'),
    ])

    const categories = collection.categories().toArray().map((category) => category.toString())

    expect(categories).toEqual(['Architecture', 'Testing'])
  })

  it('toArray() returns a snapshot that does not mutate the original', () => {
    const post = PostMother.random()
    const collection = PostCollection.create([post])

    const snapshot = collection.toArray()
    snapshot.push(PostMother.random())

    expect(collection.length).toBe(1)
  })
})
