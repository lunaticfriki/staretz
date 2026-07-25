import { describe, expect, it } from 'vitest'
import { SearchCriteria } from '../SearchCriteria.valueObject'

describe('SearchCriteria', () => {
  it('trims the term on create', () => {
    expect(SearchCriteria.create('  architecture  ').term).toBe('architecture')
  })

  it('empty() has no term', () => {
    expect(SearchCriteria.empty().term).toBe('')
  })

  it('isEmpty is true for an empty or whitespace-only term', () => {
    expect(SearchCriteria.empty().isEmpty).toBe(true)
    expect(SearchCriteria.create('   ').isEmpty).toBe(true)
  })

  it('isEmpty is false once there is a term', () => {
    expect(SearchCriteria.create('architecture').isEmpty).toBe(false)
  })

  it('matches() is case-insensitive substring matching', () => {
    const criteria = SearchCriteria.create('arch')

    expect(criteria.matches('Architecture')).toBe(true)
    expect(criteria.matches('ARCHITECTURE')).toBe(true)
    expect(criteria.matches('Testing')).toBe(false)
  })

  it('matches() matches everything when empty', () => {
    expect(SearchCriteria.empty().matches('anything')).toBe(true)
  })

  it('equals() compares case-insensitively', () => {
    expect(SearchCriteria.create('Architecture').equals(SearchCriteria.create('architecture'))).toBe(true)
    expect(SearchCriteria.create('Architecture').equals(SearchCriteria.create('testing'))).toBe(false)
  })
})
