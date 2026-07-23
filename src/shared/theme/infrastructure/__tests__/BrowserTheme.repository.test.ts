// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Theme } from '../../domain/value-objects/Theme.valueObject'
import { BrowserThemeRepository } from '../BrowserTheme.repository'

function stubMatchMedia(matches: boolean) {
  window.matchMedia = (query: string) =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

describe('BrowserThemeRepository', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('getPersisted() returns null when nothing is stored', () => {
    const repository = new BrowserThemeRepository()

    expect(repository.getPersisted()).toBeNull()
  })

  it('getPersisted() returns the previously persisted theme', () => {
    const repository = new BrowserThemeRepository()
    repository.persist(Theme.dark())

    expect(repository.getPersisted()?.equals(Theme.dark())).toBe(true)
  })

  it('persist() writes the theme mode to localStorage', () => {
    const repository = new BrowserThemeRepository()
    repository.persist(Theme.light())

    expect(window.localStorage.getItem('staretz:theme')).toBe('light')
  })

  it('apply() adds the dark class for the dark theme', () => {
    const repository = new BrowserThemeRepository()
    repository.apply(Theme.dark())

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('apply() removes the dark class for the light theme', () => {
    document.documentElement.classList.add('dark')
    const repository = new BrowserThemeRepository()
    repository.apply(Theme.light())

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('getSystemPreference() reflects a dark OS preference', () => {
    stubMatchMedia(true)
    const repository = new BrowserThemeRepository()

    expect(repository.getSystemPreference().equals(Theme.dark())).toBe(true)
  })

  it('getSystemPreference() reflects a light OS preference', () => {
    stubMatchMedia(false)
    const repository = new BrowserThemeRepository()

    expect(repository.getSystemPreference().equals(Theme.light())).toBe(true)
  })
})
