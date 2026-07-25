import { describe, expect, it } from 'vitest'
import { PostMother } from '../../domain/entities/__tests__/Post.mother'
import { PostNotFoundError } from '../../domain/errors/PostNotFound.error'
import { Slug } from '../../domain/value-objects/Slug.valueObject'
import { FakePostRepository } from '../FakePost.repository'

describe('FakePostRepository', () => {
  it('loads all 20 seed posts as valid domain entities', async () => {
    const repository = new FakePostRepository()
    const posts = (await repository.findAll()).toArray()

    expect(posts).toHaveLength(20)
  })

  it('finds a known seed post by slug', async () => {
    const repository = new FakePostRepository()
    const post = await repository.findBySlug(Slug.create('hexagonal-architecture-explained'))

    expect(post).not.toBeNull()
    expect(post?.title.toString()).toBe('Hexagonal Architecture Explained')
    expect(post?.author.toString()).toBe('Marco Reyes')
  })

  it('returns null for an unknown slug', async () => {
    const repository = new FakePostRepository()
    const post = await repository.findBySlug(Slug.create('does-not-exist'))

    expect(post).toBeNull()
  })

  it('every seed post has distinct, chronologically valid publishedAt dates', async () => {
    const repository = new FakePostRepository()
    const posts = (await repository.findAll()).toArray()
    const timestamps = posts.map((post) => post.publishedAt.toDate().getTime())

    expect(new Set(timestamps).size).toBe(posts.length)
  })

  it('save() adds the post so it is immediately findable by slug', async () => {
    const repository = new FakePostRepository()
    const post = PostMother.withSlug('freshly-created-post')

    await repository.save(post)
    const found = await repository.findBySlug(Slug.create('freshly-created-post'))
    const all = (await repository.findAll()).toArray()

    expect(found).toBe(post)
    expect(all).toHaveLength(21)
  })

  it('update() replaces the post with the same slug', async () => {
    const repository = new FakePostRepository()
    const updated = PostMother.withSlug('hexagonal-architecture-explained')

    await repository.update(updated)
    const found = await repository.findBySlug(Slug.create('hexagonal-architecture-explained'))
    const all = (await repository.findAll()).toArray()

    expect(found).toBe(updated)
    expect(all).toHaveLength(20)
  })

  it('update() throws PostNotFoundError for an unknown slug', async () => {
    const repository = new FakePostRepository()
    const post = PostMother.withSlug('does-not-exist')

    await expect(repository.update(post)).rejects.toThrow(PostNotFoundError)
  })

  it('delete() removes the post so it is no longer findable', async () => {
    const repository = new FakePostRepository()

    await repository.delete(Slug.create('hexagonal-architecture-explained'))
    const found = await repository.findBySlug(Slug.create('hexagonal-architecture-explained'))
    const all = (await repository.findAll()).toArray()

    expect(found).toBeNull()
    expect(all).toHaveLength(19)
  })

  it('delete() throws PostNotFoundError for an unknown slug', async () => {
    const repository = new FakePostRepository()

    await expect(repository.delete(Slug.create('does-not-exist'))).rejects.toThrow(PostNotFoundError)
  })
})
