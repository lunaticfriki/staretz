import { Post } from '../domain/entities/Post.entity'
import { GetPostBySlugQuery } from './query/GetPostBySlug.query'
import { GetPostBySlugQueryHandler } from './query/GetPostBySlug.queryHandler'
import { ListLatestPostsQuery } from './query/ListLatestPosts.query'
import { ListLatestPostsQueryHandler } from './query/ListLatestPosts.queryHandler'

export abstract class PostReadService {
  abstract listLatest(query: ListLatestPostsQuery): Promise<Post[]>
  abstract getBySlug(query: GetPostBySlugQuery): Promise<Post>
}

export class PostReadServiceImpl extends PostReadService {
  constructor(
    private readonly listLatestHandler: ListLatestPostsQueryHandler,
    private readonly getBySlugHandler: GetPostBySlugQueryHandler,
  ) {
    super()
  }

  listLatest(query: ListLatestPostsQuery): Promise<Post[]> {
    return this.listLatestHandler.handle(query)
  }

  getBySlug(query: GetPostBySlugQuery): Promise<Post> {
    return this.getBySlugHandler.handle(query)
  }
}
