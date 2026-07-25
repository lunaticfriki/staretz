import type { Page } from '../../../shared/pagination/domain/value-objects/Page.valueObject'
import type { Category } from '../domain/value-objects/Category.valueObject'
import { Post } from '../domain/entities/Post.entity'
import { GetPostBySlugQuery } from './query/GetPostBySlug.query'
import { GetPostBySlugQueryHandler } from './query/GetPostBySlug.queryHandler'
import { ListCategoriesQuery } from './query/ListCategories.query'
import { ListCategoriesQueryHandler } from './query/ListCategories.queryHandler'
import { ListPostsQuery } from './query/ListPosts.query'
import { ListPostsQueryHandler } from './query/ListPosts.queryHandler'

export abstract class PostReadService {
  abstract listPosts(query: ListPostsQuery): Promise<Page<Post>>
  abstract getBySlug(query: GetPostBySlugQuery): Promise<Post>
  abstract listCategories(query: ListCategoriesQuery): Promise<Category[]>
}

export class PostReadServiceImpl extends PostReadService {
  constructor(
    private readonly listPostsHandler: ListPostsQueryHandler,
    private readonly getBySlugHandler: GetPostBySlugQueryHandler,
    private readonly listCategoriesHandler: ListCategoriesQueryHandler,
  ) {
    super()
  }

  listPosts(query: ListPostsQuery): Promise<Page<Post>> {
    return this.listPostsHandler.handle(query)
  }

  getBySlug(query: GetPostBySlugQuery): Promise<Post> {
    return this.getBySlugHandler.handle(query)
  }

  listCategories(query: ListCategoriesQuery): Promise<Category[]> {
    return this.listCategoriesHandler.handle(query)
  }
}
