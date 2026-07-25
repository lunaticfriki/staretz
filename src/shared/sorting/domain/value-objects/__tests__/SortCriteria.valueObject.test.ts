import { describe, expect, it } from 'vitest'
import { SortCriteria } from '../SortCriteria.valueObject'

type Field = 'title' | 'category'

describe('SortCriteria', () => {
  it('create() defaults to ascending', () => {
    const criteria = SortCriteria.create<Field>('title')

    expect(criteria.field).toBe('title')
    expect(criteria.direction).toBe('asc')
  })

  it('create() accepts an explicit direction', () => {
    const criteria = SortCriteria.create<Field>('title', 'desc')

    expect(criteria.direction).toBe('desc')
  })

  it('none() has no field and is empty', () => {
    const criteria = SortCriteria.none<Field>()

    expect(criteria.field).toBeNull()
    expect(criteria.isEmpty).toBe(true)
  })

  it('a criteria with a field is not empty', () => {
    expect(SortCriteria.create<Field>('title').isEmpty).toBe(false)
  })

  it('toggled() on an empty criteria sorts the given field ascending', () => {
    const next = SortCriteria.none<Field>().toggled('title')

    expect(next.field).toBe('title')
    expect(next.direction).toBe('asc')
  })

  it('toggled() on the same field flips the direction', () => {
    const ascending = SortCriteria.create<Field>('title', 'asc')

    const descending = ascending.toggled('title')
    expect(descending.direction).toBe('desc')

    const backToAscending = descending.toggled('title')
    expect(backToAscending.direction).toBe('asc')
  })

  it('toggled() on a different field resets to ascending', () => {
    const byTitleDesc = SortCriteria.create<Field>('title', 'desc')

    const byCategory = byTitleDesc.toggled('category')

    expect(byCategory.field).toBe('category')
    expect(byCategory.direction).toBe('asc')
  })

  it('equals() compares by field and direction', () => {
    expect(SortCriteria.create<Field>('title', 'asc').equals(SortCriteria.create<Field>('title', 'asc'))).toBe(true)
    expect(SortCriteria.create<Field>('title', 'asc').equals(SortCriteria.create<Field>('title', 'desc'))).toBe(false)
    expect(SortCriteria.create<Field>('title', 'asc').equals(SortCriteria.create<Field>('category', 'asc'))).toBe(
      false,
    )
  })
})
