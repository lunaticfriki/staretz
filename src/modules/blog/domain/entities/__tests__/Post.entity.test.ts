import { describe, expect, it } from 'vitest'
import { InvalidPostTitleError, PostTitle } from '../../value-objects/PostTitle.valueObject'
import { InvalidSlugError, Slug } from '../../value-objects/Slug.valueObject'
import { PostMother } from './Post.mother'

describe('Post', () => {
  it('builds a valid post through the create factory', () => {
    const post = PostMother.withSlug('hello-world')

    expect(post.slug.toString()).toBe('hello-world')
  })

  it('rejects an empty title', () => {
    expect(() => PostTitle.create('   ')).toThrow(InvalidPostTitleError)
  })

  it('rejects a slug with invalid characters', () => {
    expect(() => Slug.create('Not A Slug!')).toThrow(InvalidSlugError)
  })

  it('empty() returns a neutral placeholder post', () => {
    const post = PostMother.empty()

    expect(post.slug.toString()).toBe('')
    expect(post.title.toString()).toBe('')
  })

  it('publishedAt tracks ordering between two posts', () => {
    const older = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const newer = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))

    expect(newer.publishedAt.isAfter(older.publishedAt)).toBe(true)
  })
})
