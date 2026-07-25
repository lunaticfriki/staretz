import { describe, expect, it } from 'vitest'
import { PolicyContext } from '../../value-objects/PolicyContext.valueObject'
import { RequireAuthenticationPolicy } from '../RequireAuthentication.policy'

describe('RequireAuthenticationPolicy', () => {
  it('is satisfied when the context is authenticated', () => {
    const policy = new RequireAuthenticationPolicy()

    expect(policy.isSatisfiedBy(PolicyContext.create(true))).toBe(true)
  })

  it('is not satisfied when the context is unauthenticated', () => {
    const policy = new RequireAuthenticationPolicy()

    expect(policy.isSatisfiedBy(PolicyContext.create(false))).toBe(false)
  })
})
