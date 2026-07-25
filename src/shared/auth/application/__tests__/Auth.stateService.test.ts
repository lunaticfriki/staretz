import { describe, expect, it } from 'vitest'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { AuthUser } from '../../domain/value-objects/AuthUser.valueObject'
import type { AuthRepository } from '../../domain/repositories/Auth.repository'
import { AuthStateServiceImpl } from '../Auth.stateService'

describe('AuthStateServiceImpl', () => {
  it('defaults to loading before initialize() runs', () => {
    const authRepository = mock<AuthRepository>()

    const stateService = new AuthStateServiceImpl(instance(authRepository))

    expect(stateService.auth.value.status).toBe('loading')
  })

  it('becomes authenticated when the repository reports a user', () => {
    const authRepository = mock<AuthRepository>()
    const user = AuthUser.create('abc123', 'admin@example.com')
    when(authRepository.onAuthStateChanged(anything())).thenCall(
      (callback: (user: AuthUser | null) => void) => {
        callback(user)
        return () => {}
      },
    )

    const stateService = new AuthStateServiceImpl(instance(authRepository))
    stateService.initialize()

    expect(stateService.auth.value).toEqual({ status: 'authenticated', user })
  })

  it('becomes unauthenticated when the repository reports no user', () => {
    const authRepository = mock<AuthRepository>()
    when(authRepository.onAuthStateChanged(anything())).thenCall(
      (callback: (user: AuthUser | null) => void) => {
        callback(null)
        return () => {}
      },
    )

    const stateService = new AuthStateServiceImpl(instance(authRepository))
    stateService.initialize()

    expect(stateService.auth.value).toEqual({ status: 'unauthenticated' })
  })

  it('initialize() only subscribes once even if called multiple times', () => {
    const authRepository = mock<AuthRepository>()
    when(authRepository.onAuthStateChanged(anything())).thenReturn(() => {})

    const stateService = new AuthStateServiceImpl(instance(authRepository))
    stateService.initialize()
    stateService.initialize()

    verify(authRepository.onAuthStateChanged(anything())).once()
  })

  it('login() authenticates through the repository', async () => {
    const authRepository = mock<AuthRepository>()
    const user = AuthUser.create('abc123', 'admin@example.com')
    when(authRepository.login('admin@example.com', 'secret')).thenResolve(user)

    const stateService = new AuthStateServiceImpl(instance(authRepository))
    await stateService.login('admin@example.com', 'secret')

    expect(stateService.auth.value).toEqual({ status: 'authenticated', user })
  })

  it('logout() clears the session through the repository', async () => {
    const authRepository = mock<AuthRepository>()
    when(authRepository.logout()).thenResolve()

    const stateService = new AuthStateServiceImpl(instance(authRepository))
    await stateService.logout()

    expect(stateService.auth.value).toEqual({ status: 'unauthenticated' })
    verify(authRepository.logout()).once()
  })
})
