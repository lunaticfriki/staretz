import { AuthUser } from '../value-objects/AuthUser.valueObject'

export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<AuthUser>
  abstract logout(): Promise<void>
  abstract onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void
}
