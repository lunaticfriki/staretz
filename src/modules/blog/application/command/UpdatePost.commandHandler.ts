import { Post } from '../../domain/entities/Post.entity'
import { Category } from '../../domain/value-objects/Category.valueObject'
import { PostAuthor } from '../../domain/value-objects/PostAuthor.valueObject'
import { PostContent } from '../../domain/value-objects/PostContent.valueObject'
import { PostExcerpt } from '../../domain/value-objects/PostExcerpt.valueObject'
import { PostGallery } from '../../domain/value-objects/PostGallery.valueObject'
import { PostImage } from '../../domain/value-objects/PostImage.valueObject'
import { PostTitle } from '../../domain/value-objects/PostTitle.valueObject'
import { PublishedAt } from '../../domain/value-objects/PublishedAt.valueObject'
import { Slug } from '../../domain/value-objects/Slug.valueObject'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import { UpdatePostCommand } from './UpdatePost.command'

export class UpdatePostCommandHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(command: UpdatePostCommand): Promise<void> {
    const post = Post.create({
      slug: Slug.create(command.slug),
      title: PostTitle.create(command.title),
      excerpt: PostExcerpt.create(command.excerpt),
      content: PostContent.create(command.content),
      author: PostAuthor.create(command.author),
      category: Category.create(command.category),
      publishedAt: PublishedAt.create(command.publishedAt),
      image: PostImage.create(command.image),
      gallery: PostGallery.create(command.gallery),
    })

    await this.posts.update(post)
  }
}
