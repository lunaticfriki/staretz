import { Slug } from '../../domain/value-objects/Slug.valueObject'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import { PostNotFoundError } from '../../domain/errors/PostNotFound.error'
import { Post } from '../../domain/entities/Post.entity'
import { GetPostBySlugQuery } from './GetPostBySlug.query'

export class GetPostBySlugQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(query: GetPostBySlugQuery): Promise<Post> {
    const slug = Slug.create(query.slug)
    const post = await this.posts.findBySlug(slug)

    if (!post) {
      throw new PostNotFoundError(query.slug)
    }

    return post
  }
}
