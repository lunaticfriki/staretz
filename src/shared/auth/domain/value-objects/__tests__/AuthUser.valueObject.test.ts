import { describe, expect, it } from 'vitest'
import { AuthUser } from '../AuthUser.valueObject'

describe('AuthUser', () => {
  it('creates a user with a uid and email', () => {
    const user = AuthUser.create('abc123', 'admin@example.com')

    expect(user.uid).toBe('abc123')
    expect(user.email).toBe('admin@example.com')
  })

  it('equals() compares by uid', () => {
    const user = AuthUser.create('abc123', 'admin@example.com')
    const sameUid = AuthUser.create('abc123', 'other@example.com')
    const differentUid = AuthUser.create('xyz789', 'admin@example.com')

    expect(user.equals(sameUid)).toBe(true)
    expect(user.equals(differentUid)).toBe(false)
  })

  it('toString() returns the email', () => {
    expect(AuthUser.create('abc123', 'admin@example.com').toString()).toBe('admin@example.com')
  })
})
