import type { PostRepository } from '../../domain/repositories/Post.repository'
import { Post } from '../../domain/entities/Post.entity'
import { ListLatestPostsQuery } from './ListLatestPosts.query'

export class ListLatestPostsQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(query: ListLatestPostsQuery): Promise<Post[]> {
    const posts = await this.posts.findAll()

    return posts
      .slice()
      .sort((a, b) => (a.publishedAt.isAfter(b.publishedAt) ? -1 : 1))
      .slice(0, query.limit)
  }
}
