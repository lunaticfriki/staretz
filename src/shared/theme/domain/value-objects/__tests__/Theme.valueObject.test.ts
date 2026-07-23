import { describe, expect, it } from 'vitest'
import { InvalidThemeModeError, Theme } from '../Theme.valueObject'

describe('Theme', () => {
  it('creates a light theme', () => {
    expect(Theme.create('light').mode).toBe('light')
  })

  it('creates a dark theme', () => {
    expect(Theme.create('dark').mode).toBe('dark')
  })

  it('rejects an invalid mode', () => {
    expect(() => Theme.create('purple')).toThrow(InvalidThemeModeError)
  })

  it('light() and dark() are equivalent to create()', () => {
    expect(Theme.light().equals(Theme.create('light'))).toBe(true)
    expect(Theme.dark().equals(Theme.create('dark'))).toBe(true)
  })

  it('toggle() flips light to dark and back', () => {
    const light = Theme.light()

    expect(light.toggle().mode).toBe('dark')
    expect(light.toggle().toggle().mode).toBe('light')
  })

  it('equals() compares by mode', () => {
    expect(Theme.light().equals(Theme.light())).toBe(true)
    expect(Theme.light().equals(Theme.dark())).toBe(false)
  })

  it('toString() returns the mode', () => {
    expect(Theme.dark().toString()).toBe('dark')
  })
})
