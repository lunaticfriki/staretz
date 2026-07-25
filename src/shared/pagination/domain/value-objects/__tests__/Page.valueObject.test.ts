import { describe, expect, it } from 'vitest'
import { PaginationCriteria } from '../PaginationCriteria.valueObject'
import { Page } from '../Page.valueObject'

describe('Page', () => {
  it('exposes the items, page, and perPage from the criteria', () => {
    const page = Page.create({ items: ['a', 'b'], criteria: PaginationCriteria.create(2, 2), totalItems: 5 })

    expect(page.items).toEqual(['a', 'b'])
    expect(page.page).toBe(2)
    expect(page.perPage).toBe(2)
    expect(page.totalItems).toBe(5)
  })

  it('totalPages() rounds up to cover every item', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(1, 5), totalItems: 19 })

    expect(page.totalPages).toBe(4)
  })

  it('totalPages() is at least 1 even when there are no items', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(1, 5), totalItems: 0 })

    expect(page.totalPages).toBe(1)
  })

  it('hasNextPage() is true when the current page is before the last', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(1, 5), totalItems: 19 })

    expect(page.hasNextPage).toBe(true)
  })

  it('hasNextPage() is false on the last page', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(4, 5), totalItems: 19 })

    expect(page.hasNextPage).toBe(false)
  })

  it('hasPreviousPage() is false on the first page', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(1, 5), totalItems: 19 })

    expect(page.hasPreviousPage).toBe(false)
  })

  it('hasPreviousPage() is true after the first page', () => {
    const page = Page.create({ items: [], criteria: PaginationCriteria.create(2, 5), totalItems: 19 })

    expect(page.hasPreviousPage).toBe(true)
  })
})
