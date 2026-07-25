import { PostCollection } from '../domain/collections/Post.collection'
import { Post } from '../domain/entities/Post.entity'
import { PostNotFoundError } from '../domain/errors/PostNotFound.error'
import { PostRepository } from '../domain/repositories/Post.repository'
import { Slug } from '../domain/value-objects/Slug.valueObject'
import { PostMapper } from './acl/Post.mapper'

const postFiles = import.meta.glob('/src/data/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export class FakePostRepository extends PostRepository {
  private readonly posts: Post[] = Object.values(postFiles).map((raw) => PostMapper.toDomain(raw))

  async findAll(): Promise<PostCollection> {
    return PostCollection.create(this.posts)
  }

  async findBySlug(slug: Slug): Promise<Post | null> {
    return this.posts.find((post) => post.slug.equals(slug)) ?? null
  }

  async save(post: Post): Promise<void> {
    this.posts.push(post)
  }

  async update(post: Post): Promise<void> {
    const index = this.posts.findIndex((existing) => existing.slug.equals(post.slug))
    if (index === -1) {
      throw new PostNotFoundError(post.slug.toString())
    }
    this.posts[index] = post
  }

  async delete(slug: Slug): Promise<void> {
    const index = this.posts.findIndex((existing) => existing.slug.equals(slug))
    if (index === -1) {
      throw new PostNotFoundError(slug.toString())
    }
    this.posts.splice(index, 1)
  }
}
