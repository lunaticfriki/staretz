import { Policy } from '../Policy'
import type { PolicyContext } from '../value-objects/PolicyContext.valueObject'

export class RequireAuthenticationPolicy extends Policy {
  isSatisfiedBy(context: PolicyContext): boolean {
    return context.isAuthenticated
  }
}
