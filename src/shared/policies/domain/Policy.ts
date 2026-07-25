import type { PolicyContext } from './value-objects/PolicyContext.valueObject'

export abstract class Policy {
  abstract isSatisfiedBy(context: PolicyContext): boolean
}
