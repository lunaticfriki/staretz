import type { Policy } from '../domain/Policy'
import type { PolicyContext } from '../domain/value-objects/PolicyContext.valueObject'
import type { PolicyName } from '../domain/value-objects/PolicyName.valueObject'

export abstract class PolicyService {
  abstract can(name: PolicyName, context: PolicyContext): boolean
}

export class PolicyServiceImpl extends PolicyService {
  constructor(private readonly policies: Map<string, Policy>) {
    super()
  }

  can(name: PolicyName, context: PolicyContext): boolean {
    const policy = this.policies.get(name.toString())
    // An unregistered policy name denies by default (fail closed), never allows.
    return policy ? policy.isSatisfiedBy(context) : false
  }
}
