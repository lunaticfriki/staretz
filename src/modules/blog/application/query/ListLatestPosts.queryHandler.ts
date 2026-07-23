import type { PostRepository } from '../../domain/repositories/Post.repository'
import type { PostCollection } from '../../domain/collections/Post.collection'
import { ListLatestPostsQuery } from './ListLatestPosts.query'

export class ListLatestPostsQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(query: ListLatestPostsQuery): Promise<PostCollection> {
    const posts = await this.posts.findAll()

    return posts.sortedByMostRecent().take(query.limit)
  }
}
