import { Post } from '../entities/Post.entity'
import { Slug } from '../value-objects/Slug.valueObject'

export abstract class PostRepository {
  abstract findAll(): Promise<Post[]>
  abstract findBySlug(slug: Slug): Promise<Post | null>
}
