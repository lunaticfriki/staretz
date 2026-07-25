export class PolicyContext {
  private constructor(public readonly isAuthenticated: boolean) {}

  static create(isAuthenticated: boolean): PolicyContext {
    return new PolicyContext(isAuthenticated)
  }
}
