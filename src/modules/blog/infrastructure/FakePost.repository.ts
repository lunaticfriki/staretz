import { Post } from '../domain/entities/Post.entity'
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

  async findAll(): Promise<Post[]> {
    return this.posts
  }

  async findBySlug(slug: Slug): Promise<Post | null> {
    return this.posts.find((post) => post.slug.equals(slug)) ?? null
  }
}
