export class AuthUser {
  private constructor(
    public readonly uid: string,
    public readonly email: string,
  ) {}

  static create(uid: string, email: string): AuthUser {
    return new AuthUser(uid, email)
  }

  equals(other: AuthUser): boolean {
    return this.uid === other.uid
  }

  toString(): string {
    return this.email
  }
}
