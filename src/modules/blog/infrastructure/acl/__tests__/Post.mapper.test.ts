import { describe, expect, it } from 'vitest'
import { PostMapper } from '../Post.mapper'

function markdown(frontmatterExtra = ''): string {
  return `---
slug: hexagonal-architecture-explained
title: Hexagonal Architecture Explained
excerpt: A short summary shown in the preview card.
author: Marco Reyes
publishedAt: 2026-01-19
category: Architecture
${frontmatterExtra}---

Markdown body content.
`
}

describe('PostMapper', () => {
  it('maps frontmatter and body into a Post', () => {
    const post = PostMapper.toDomain(markdown())

    expect(post.slug.toString()).toBe('hexagonal-architecture-explained')
    expect(post.title.toString()).toBe('Hexagonal Architecture Explained')
    expect(post.category.toString()).toBe('Architecture')
    expect(post.content.toString()).toBe('Markdown body content.')
  })

  it('falls back to a deterministic placeholder image when no image frontmatter is set', () => {
    const post = PostMapper.toDomain(markdown())

    expect(post.image.toString()).toBe('https://picsum.photos/seed/hexagonal-architecture-explained/1200/800')
  })

  it('uses the frontmatter image when present', () => {
    const post = PostMapper.toDomain(markdown('image: https://cdn.example.com/hexagonal-architecture.jpg\n'))

    expect(post.image.toString()).toBe('https://cdn.example.com/hexagonal-architecture.jpg')
  })
})
