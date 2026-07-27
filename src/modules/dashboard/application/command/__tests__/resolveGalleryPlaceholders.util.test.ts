import { describe, expect, it } from 'vitest'
import { resolveGalleryPlaceholders } from '../resolveGalleryPlaceholders.util'

describe('resolveGalleryPlaceholders', () => {
  it('replaces gallery:N placeholders with the matching uploaded URL', () => {
    const content = 'Text before. ![alt](gallery:0) Text between. ![other](gallery:1) Text after.'

    const resolved = resolveGalleryPlaceholders(content, [
      'https://storage.example.com/one.jpg',
      'https://storage.example.com/two.jpg',
    ])

    expect(resolved).toBe(
      'Text before. ![alt](https://storage.example.com/one.jpg) Text between. ' +
        '![other](https://storage.example.com/two.jpg) Text after.',
    )
  })

  it('leaves content untouched when there are no placeholders', () => {
    const content = 'Just plain text with no gallery references.'

    expect(resolveGalleryPlaceholders(content, ['https://storage.example.com/unused.jpg'])).toBe(content)
  })

  it('leaves an out-of-range placeholder as-is', () => {
    const content = '![alt](gallery:5)'

    expect(resolveGalleryPlaceholders(content, ['https://storage.example.com/one.jpg'])).toBe(content)
  })
})
