import { DomainError } from '../../../errors/domain/Domain.error'

export class InvalidPolicyNameError extends DomainError {
  constructor() {
    super('Policy name cannot be empty')
  }
}

export class PolicyName {
  private constructor(public readonly value: string) {}

  static create(value: string): PolicyName {
    if (!value.trim()) {
      throw new InvalidPolicyNameError()
    }
    return new PolicyName(value.trim())
  }

  equals(other: PolicyName): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
