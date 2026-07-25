import { signal, type Signal } from '@preact/signals-core'
import { AuthUser } from '../domain/value-objects/AuthUser.valueObject'
import type { AuthRepository } from '../domain/repositories/Auth.repository'

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated' }

export abstract class AuthStateService {
  abstract readonly auth: Signal<AuthState>
  abstract initialize(): void
  abstract login(email: string, password: string): Promise<void>
  abstract logout(): Promise<void>
}

export class AuthStateServiceImpl extends AuthStateService {
  readonly auth = signal<AuthState>({ status: 'loading' })

  private subscribed = false

  constructor(private readonly authRepository: AuthRepository) {
    super()
  }

  initialize(): void {
    if (this.subscribed) {
      return
    }
    this.subscribed = true

    this.authRepository.onAuthStateChanged((user) => {
      this.auth.value = user ? { status: 'authenticated', user } : { status: 'unauthenticated' }
    })
  }

  async login(email: string, password: string): Promise<void> {
    const user = await this.authRepository.login(email, password)
    this.auth.value = { status: 'authenticated', user }
  }

  async logout(): Promise<void> {
    await this.authRepository.logout()
    this.auth.value = { status: 'unauthenticated' }
  }
}
