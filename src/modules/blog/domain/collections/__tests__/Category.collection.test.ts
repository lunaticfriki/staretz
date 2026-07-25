import { describe, expect, it } from 'vitest'
import { SearchCriteria } from '../../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { Category } from '../../value-objects/Category.valueObject'
import { CategoryCollection } from '../Category.collection'

describe('CategoryCollection', () => {
  it('exposes its length', () => {
    const collection = CategoryCollection.create([Category.create('Architecture'), Category.create('Testing')])

    expect(collection.length).toBe(2)
  })

  it('matching() keeps only categories whose name matches the criteria', () => {
    const architecture = Category.create('Architecture')
    const testing = Category.create('Testing')
    const collection = CategoryCollection.create([architecture, testing])

    const matched = collection.matching(SearchCriteria.create('arch'))

    expect(matched.toArray()).toEqual([architecture])
  })

  it('matching() keeps everything when the criteria is empty', () => {
    const collection = CategoryCollection.create([Category.create('Architecture'), Category.create('Testing')])

    const matched = collection.matching(SearchCriteria.empty())

    expect(matched.length).toBe(2)
  })

  it('matching() is case-insensitive', () => {
    const frontend = Category.create('Frontend')
    const collection = CategoryCollection.create([frontend])

    const matched = collection.matching(SearchCriteria.create('FRONT'))

    expect(matched.toArray()).toEqual([frontend])
  })

  it('toArray() returns a snapshot that does not mutate the original', () => {
    const category = Category.create('Architecture')
    const collection = CategoryCollection.create([category])

    const snapshot = collection.toArray()
    snapshot.push(Category.create('Testing'))

    expect(collection.length).toBe(1)
  })
})
