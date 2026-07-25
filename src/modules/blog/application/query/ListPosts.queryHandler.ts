import type { Page } from '../../../../shared/pagination/domain/value-objects/Page.valueObject'
import type { Post } from '../../domain/entities/Post.entity'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import { ListPostsQuery } from './ListPosts.query'

export class ListPostsQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(query: ListPostsQuery): Promise<Page<Post>> {
    const posts = await this.posts.findAll()
    const filtered = posts.search(query.search)
    const sorted = query.sort.isEmpty ? filtered.sortedByMostRecent() : filtered.sortBy(query.sort)

    return sorted.paginate(query.pagination)
  }
}
