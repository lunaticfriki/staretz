import type { Category } from '../../domain/value-objects/Category.valueObject'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import type { ListCategoriesQuery } from './ListCategories.query'

export class ListCategoriesQueryHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(_query: ListCategoriesQuery): Promise<Category[]> {
    const posts = await this.posts.findAll()

    return posts.categories()
  }
}
