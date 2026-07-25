import { describe, expect, it } from 'vitest'
import { InvalidPolicyNameError, PolicyName } from '../PolicyName.valueObject'

describe('PolicyName', () => {
  it('creates a policy name', () => {
    expect(PolicyName.create('dashboard:access').toString()).toBe('dashboard:access')
  })

  it('trims whitespace', () => {
    expect(PolicyName.create('  dashboard:access  ').toString()).toBe('dashboard:access')
  })

  it('rejects an empty name', () => {
    expect(() => PolicyName.create('   ')).toThrow(InvalidPolicyNameError)
  })

  it('equals() compares by value', () => {
    expect(PolicyName.create('dashboard:access').equals(PolicyName.create('dashboard:access'))).toBe(true)
    expect(PolicyName.create('dashboard:access').equals(PolicyName.create('other:access'))).toBe(false)
  })
})
