import { describe, expect, it } from 'vitest'
import { deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { Theme } from '../../domain/value-objects/Theme.valueObject'
import type { ThemeRepository } from '../../domain/repositories/Theme.repository'
import { ThemeStateServiceImpl } from '../Theme.stateService'

describe('ThemeStateServiceImpl', () => {
  it('defaults to the light theme before initialize() runs', () => {
    const themeRepository = mock<ThemeRepository>()

    const stateService = new ThemeStateServiceImpl(instance(themeRepository))

    expect(stateService.theme.value.mode).toBe('light')
  })

  it('initializes from the persisted theme when one is stored', () => {
    const themeRepository = mock<ThemeRepository>()
    when(themeRepository.getPersisted()).thenReturn(Theme.dark())

    const stateService = new ThemeStateServiceImpl(instance(themeRepository))
    stateService.initialize()

    expect(stateService.theme.value.mode).toBe('dark')
    verify(themeRepository.persist(deepEqual(Theme.dark()))).once()
    verify(themeRepository.apply(deepEqual(Theme.dark()))).once()
  })

  it('falls back to the system preference when nothing is persisted', () => {
    const themeRepository = mock<ThemeRepository>()
    when(themeRepository.getPersisted()).thenReturn(null)
    when(themeRepository.getSystemPreference()).thenReturn(Theme.dark())

    const stateService = new ThemeStateServiceImpl(instance(themeRepository))
    stateService.initialize()

    expect(stateService.theme.value.mode).toBe('dark')
  })

  it('toggle() flips the current theme and persists + applies it', () => {
    const themeRepository = mock<ThemeRepository>()
    when(themeRepository.getPersisted()).thenReturn(Theme.light())

    const stateService = new ThemeStateServiceImpl(instance(themeRepository))
    stateService.initialize()
    stateService.toggle()

    expect(stateService.theme.value.mode).toBe('dark')
    verify(themeRepository.persist(deepEqual(Theme.dark()))).once()
    verify(themeRepository.apply(deepEqual(Theme.dark()))).once()
  })
})
