import { PostCollection } from '../collections/Post.collection'
import { Post } from '../entities/Post.entity'
import { Slug } from '../value-objects/Slug.valueObject'

export abstract class PostRepository {
  abstract findAll(): Promise<PostCollection>
  abstract findBySlug(slug: Slug): Promise<Post | null>
  abstract save(post: Post): Promise<void>
}
