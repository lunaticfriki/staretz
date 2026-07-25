import { Timestamp, type DocumentData } from 'firebase/firestore/lite'
import { Post } from '../../domain/entities/Post.entity'
import { Category } from '../../domain/value-objects/Category.valueObject'
import { PostAuthor } from '../../domain/value-objects/PostAuthor.valueObject'
import { PostContent } from '../../domain/value-objects/PostContent.valueObject'
import { PostExcerpt } from '../../domain/value-objects/PostExcerpt.valueObject'
import { PostImage } from '../../domain/value-objects/PostImage.valueObject'
import { PostTitle } from '../../domain/value-objects/PostTitle.valueObject'
import { PublishedAt } from '../../domain/value-objects/PublishedAt.valueObject'
import { Slug } from '../../domain/value-objects/Slug.valueObject'
import { postImagePlaceholderUrl } from './postImagePlaceholder.util'

export class FirestorePostMapper {
  static toDomain(data: DocumentData): Post {
    const publishedAt = data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : data.publishedAt

    return Post.create({
      slug: Slug.create(data.slug),
      title: PostTitle.create(data.title),
      excerpt: PostExcerpt.create(data.excerpt),
      content: PostContent.create(data.content),
      author: PostAuthor.create(data.author),
      publishedAt: PublishedAt.create(publishedAt),
      category: Category.create(data.category),
      image: PostImage.create(data.image || postImagePlaceholderUrl(data.slug)),
    })
  }

  static toPersistence(post: Post): DocumentData {
    return {
      slug: post.slug.toString(),
      title: post.title.toString(),
      excerpt: post.excerpt.toString(),
      content: post.content.toString(),
      author: post.author.toString(),
      publishedAt: Timestamp.fromDate(post.publishedAt.toDate()),
      category: post.category.toString(),
      image: post.image.toString(),
    }
  }
}
