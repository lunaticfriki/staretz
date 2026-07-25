import { describe, expect, it } from 'vitest'
import { InvalidPaginationCriteriaError, PaginationCriteria } from '../PaginationCriteria.valueObject'

describe('PaginationCriteria', () => {
  it('creates a valid criteria', () => {
    const criteria = PaginationCriteria.create(2, 5)

    expect(criteria.page).toBe(2)
    expect(criteria.perPage).toBe(5)
  })

  it('rejects a page below 1', () => {
    expect(() => PaginationCriteria.create(0, 5)).toThrow(InvalidPaginationCriteriaError)
  })

  it('rejects a non-integer page', () => {
    expect(() => PaginationCriteria.create(1.5, 5)).toThrow(InvalidPaginationCriteriaError)
  })

  it('rejects a perPage below 1', () => {
    expect(() => PaginationCriteria.create(1, 0)).toThrow(InvalidPaginationCriteriaError)
  })

  it('rejects a non-integer perPage', () => {
    expect(() => PaginationCriteria.create(1, 5.5)).toThrow(InvalidPaginationCriteriaError)
  })

  it('offset() is zero on the first page', () => {
    expect(PaginationCriteria.create(1, 5).offset).toBe(0)
  })

  it('offset() advances by perPage on later pages', () => {
    expect(PaginationCriteria.create(3, 5).offset).toBe(10)
  })

  it('withPage() returns a new criteria with the same perPage', () => {
    const criteria = PaginationCriteria.create(1, 5)

    const next = criteria.withPage(2)

    expect(next.page).toBe(2)
    expect(next.perPage).toBe(5)
  })

  it('equals() compares by page and perPage', () => {
    expect(PaginationCriteria.create(1, 5).equals(PaginationCriteria.create(1, 5))).toBe(true)
    expect(PaginationCriteria.create(1, 5).equals(PaginationCriteria.create(2, 5))).toBe(false)
  })
})
