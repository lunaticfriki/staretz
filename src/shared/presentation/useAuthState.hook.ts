import { useEffect } from 'preact/hooks'
import { container } from '../../composition-root'
import type { AuthState, AuthStateService } from '../auth/application/Auth.stateService'
import { TYPES } from '../di/types'

interface AuthStateResult {
  auth: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export function useAuthState(): AuthStateResult {
  const authStateService = container.get<AuthStateService>(TYPES.AuthStateService)

  useEffect(() => {
    authStateService.initialize()
  }, [])

  return {
    auth: authStateService.auth.value,
    login: (email, password) => authStateService.login(email, password),
    logout: () => authStateService.logout(),
  }
}
