import { container } from '../../composition-root'
import { PolicyContext } from '../policies/domain/value-objects/PolicyContext.valueObject'
import type { PolicyName } from '../policies/domain/value-objects/PolicyName.valueObject'
import { PolicyService } from '../policies/application/Policy.service'
import { TYPES } from '../di/types'
import { useAuthState } from './useAuthState.hook'

export function usePolicy(name: PolicyName): boolean {
  const policyService = container.get<PolicyService>(TYPES.PolicyService)
  const { auth } = useAuthState()

  return policyService.can(name, PolicyContext.create(auth.status === 'authenticated'))
}
