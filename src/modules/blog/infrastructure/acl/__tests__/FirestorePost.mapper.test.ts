import { Timestamp } from 'firebase/firestore/lite'
import { describe, expect, it } from 'vitest'
import { InvalidCategoryError } from '../../../domain/value-objects/Category.valueObject'
import { PostMother } from '../../../domain/entities/__tests__/Post.mother'
import { FirestorePostMapper } from '../FirestorePost.mapper'

function documentData(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    slug: 'hexagonal-architecture-explained',
    title: 'Hexagonal Architecture Explained',
    excerpt: 'A short summary shown in the preview card.',
    content: 'Markdown body content.',
    author: 'Marco Reyes',
    publishedAt: Timestamp.fromDate(new Date('2026-01-19T00:00:00Z')),
    category: 'Architecture',
    ...overrides,
  }
}

describe('FirestorePostMapper', () => {
  it('maps a Firestore document into a Post, reading the slug from the document data', () => {
    const post = FirestorePostMapper.toDomain(documentData())

    expect(post.slug.toString()).toBe('hexagonal-architecture-explained')
    expect(post.title.toString()).toBe('Hexagonal Architecture Explained')
    expect(post.excerpt.toString()).toBe('A short summary shown in the preview card.')
    expect(post.content.toString()).toBe('Markdown body content.')
    expect(post.author.toString()).toBe('Marco Reyes')
    expect(post.category.toString()).toBe('Architecture')
  })

  it('converts a Firestore Timestamp into the domain PublishedAt', () => {
    const post = FirestorePostMapper.toDomain(documentData())

    expect(post.publishedAt.toISOString()).toBe(new Date('2026-01-19T00:00:00Z').toISOString())
  })

  it('accepts a plain date value for publishedAt, not only a Timestamp', () => {
    const post = FirestorePostMapper.toDomain(documentData({ publishedAt: '2026-01-19T00:00:00Z' }))

    expect(post.publishedAt.toISOString()).toBe(new Date('2026-01-19T00:00:00Z').toISOString())
  })

  it('still enforces domain validation through the value object factories', () => {
    expect(() => FirestorePostMapper.toDomain(documentData({ category: '' }))).toThrow(InvalidCategoryError)
  })

  it('uses the document image when present', () => {
    const post = FirestorePostMapper.toDomain(
      documentData({ image: 'https://cdn.example.com/hexagonal-architecture.jpg' }),
    )

    expect(post.image.toString()).toBe('https://cdn.example.com/hexagonal-architecture.jpg')
  })

  it('falls back to a deterministic placeholder image, seeded by slug, when image is missing', () => {
    const post = FirestorePostMapper.toDomain(documentData())

    expect(post.image.toString()).toBe('https://picsum.photos/seed/hexagonal-architecture-explained/1200/800')
  })

  it('reads the gallery image URLs when present', () => {
    const post = FirestorePostMapper.toDomain(
      documentData({ gallery: ['https://cdn.example.com/one.jpg', 'https://cdn.example.com/two.jpg'] }),
    )

    expect(post.gallery.toArray()).toEqual(['https://cdn.example.com/one.jpg', 'https://cdn.example.com/two.jpg'])
  })

  it('defaults to an empty gallery when the field is missing', () => {
    const post = FirestorePostMapper.toDomain(documentData())

    expect(post.gallery.toArray()).toEqual([])
  })

  it('toPersistence() maps a Post back into a Firestore document shape', () => {
    const post = PostMother.withGallery(['https://cdn.example.com/one.jpg'])

    const data = FirestorePostMapper.toPersistence(post)

    expect(data.slug).toBe('sample-post')
    expect(data.title).toBe(post.title.toString())
    expect(data.category).toBe(post.category.toString())
    expect(data.image).toBe(post.image.toString())
    expect(data.gallery).toEqual(['https://cdn.example.com/one.jpg'])
    expect(data.publishedAt).toBeInstanceOf(Timestamp)
  })

  it('toPersistence() then toDomain() round-trips to an equivalent Post', () => {
    const post = PostMother.withGallery(['https://cdn.example.com/one.jpg', 'https://cdn.example.com/two.jpg'])

    const roundTripped = FirestorePostMapper.toDomain(FirestorePostMapper.toPersistence(post))

    expect(roundTripped.slug.toString()).toBe(post.slug.toString())
    expect(roundTripped.title.toString()).toBe(post.title.toString())
    expect(roundTripped.publishedAt.toISOString()).toBe(post.publishedAt.toISOString())
    expect(roundTripped.gallery.toArray()).toEqual(post.gallery.toArray())
  })
})
