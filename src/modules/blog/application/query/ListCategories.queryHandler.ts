import type { CategoryCollection } from '../../domain/collections/Category.collection'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import type { ListCategoriesQuery } from './ListCategories.query'

export class ListCategoriesQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(_query: ListCategoriesQuery): Promise<CategoryCollection> {
    const posts = await this.posts.findAll()

    return posts.categories()
  }
}
