import { describe, expect, it } from 'vitest'
import { PostMother } from '../../entities/__tests__/Post.mother'
import { PostCollection } from '../Post.collection'

describe('PostCollection', () => {
  it('exposes its length', () => {
    const collection = PostCollection.create([PostMother.random(), PostMother.random()])

    expect(collection.length).toBe(2)
  })

  it('sortedByMostRecent() orders posts from newest to oldest', () => {
    const oldest = PostMother.publishedAt(new Date('2026-01-01T00:00:00Z'))
    const newest = PostMother.publishedAt(new Date('2026-03-01T00:00:00Z'))
    const middle = PostMother.publishedAt(new Date('2026-02-01T00:00:00Z'))
    const collection = PostCollection.create([oldest, newest, middle])

    const sorted = collection.sortedByMostRecent().toArray()

    expect(sorted).toEqual([newest, middle, oldest])
  })

  it('take() limits the collection to the given count', () => {
    const collection = PostCollection.create([PostMother.random(), PostMother.random(), PostMother.random()])

    expect(collection.take(2).length).toBe(2)
  })

  it('toArray() returns a snapshot that does not mutate the original', () => {
    const post = PostMother.random()
    const collection = PostCollection.create([post])

    const snapshot = collection.toArray()
    snapshot.push(PostMother.random())

    expect(collection.length).toBe(1)
  })
})
