import { describe, expect, it } from 'vitest'
import { PaginationCriteria } from '../../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import { SearchCriteria } from '../../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { SortCriteria } from '../../../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'
import { PostMother } from '../../entities/__tests__/Post.mother'
import { PostCollection, type PostSortField } from '../Post.collection'

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

  it('sortBy() returns the same collection when the criteria is empty', () => {
    const posts = [PostMother.titled('B'), PostMother.titled('A')]
    const collection = PostCollection.create(posts)

    const sorted = collection.sortBy(SortCriteria.none<PostSortField>())

    expect(sorted.toArray()).toEqual(posts)
  })

  it('sortBy("title") orders alphabetically, ascending or descending', () => {
    const b = PostMother.titled('Banana')
    const a = PostMother.titled('Apple')
    const c = PostMother.titled('Cherry')
    const collection = PostCollection.create([b, a, c])

    expect(collection.sortBy(SortCriteria.create('title', 'asc')).toArray()).toEqual([a, b, c])
    expect(collection.sortBy(SortCriteria.create('title', 'desc')).toArray()).toEqual([c, b, a])
  })

  it('sortBy("category") orders alphabetically', () => {
    const testing = PostMother.category('Testing')
    const architecture = PostMother.category('Architecture')
    const collection = PostCollection.create([testing, architecture])

    expect(collection.sortBy(SortCriteria.create('category', 'asc')).toArray()).toEqual([architecture, testing])
  })

  it('sortBy("publishedAt") orders chronologically', () => {
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    const collection = PostCollection.create([newest, oldest])

    expect(collection.sortBy(SortCriteria.create('publishedAt', 'asc')).toArray()).toEqual([oldest, newest])
    expect(collection.sortBy(SortCriteria.create('publishedAt', 'desc')).toArray()).toEqual([newest, oldest])
  })

  it('paginate() slices the collection according to the criteria', () => {
    const posts = [PostMother.random(), PostMother.random(), PostMother.random()]
    const collection = PostCollection.create(posts)

    const page = collection.paginate(PaginationCriteria.create(2, 2))

    expect(page.items).toEqual([posts[2]])
    expect(page.totalItems).toBe(3)
    expect(page.totalPages).toBe(2)
  })

  it('search() keeps posts whose category matches the criteria', () => {
    const architecture = PostMother.category('Architecture')
    const testing = PostMother.category('Testing')
    const collection = PostCollection.create([architecture, testing])

    const filtered = collection.search(SearchCriteria.create('arch'))

    expect(filtered.toArray()).toEqual([architecture])
  })

  it('search() keeps posts whose title matches the criteria', () => {
    const gould = PostMother.titled('Glenn Gould')
    const other = PostMother.titled('Something Else')
    const collection = PostCollection.create([gould, other])

    const filtered = collection.search(SearchCriteria.create('gould'))

    expect(filtered.toArray()).toEqual([gould])
  })

  it('search() keeps posts whose author matches the criteria', () => {
    const marco = PostMother.authored('Marco Reyes')
    const jane = PostMother.authored('Jane Doe')
    const collection = PostCollection.create([marco, jane])

    const filtered = collection.search(SearchCriteria.create('marco'))

    expect(filtered.toArray()).toEqual([marco])
  })

  it('search() keeps posts whose content matches the criteria', () => {
    const hexagonal = PostMother.withContent('An explanation of hexagonal architecture.')
    const other = PostMother.withContent('Something unrelated.')
    const collection = PostCollection.create([hexagonal, other])

    const filtered = collection.search(SearchCriteria.create('hexagonal'))

    expect(filtered.toArray()).toEqual([hexagonal])
  })

  it('search() keeps everything when the criteria is empty', () => {
    const architecture = PostMother.category('Architecture')
    const testing = PostMother.category('Testing')
    const collection = PostCollection.create([architecture, testing])

    const filtered = collection.search(SearchCriteria.empty())

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
