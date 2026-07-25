import { describe, expect, it } from 'vitest'
import { PolicyContext } from '../../domain/value-objects/PolicyContext.valueObject'
import { PolicyName } from '../../domain/value-objects/PolicyName.valueObject'
import { RequireAuthenticationPolicy } from '../../domain/policies/RequireAuthentication.policy'
import { PolicyServiceImpl } from '../Policy.service'

describe('PolicyServiceImpl', () => {
  it('can() delegates to the registered policy', () => {
    const policyName = PolicyName.create('dashboard:access')
    const service = new PolicyServiceImpl(new Map([[policyName.toString(), new RequireAuthenticationPolicy()]]))

    expect(service.can(policyName, PolicyContext.create(true))).toBe(true)
    expect(service.can(policyName, PolicyContext.create(false))).toBe(false)
  })

  it('can() denies by default for an unregistered policy name', () => {
    const service = new PolicyServiceImpl(new Map())

    expect(service.can(PolicyName.create('unknown:policy'), PolicyContext.create(true))).toBe(false)
  })
})
