import { Post } from '../../domain/entities/Post.entity'
import { PostAuthor } from '../../domain/value-objects/PostAuthor.valueObject'
import { PostContent } from '../../domain/value-objects/PostContent.valueObject'
import { PostExcerpt } from '../../domain/value-objects/PostExcerpt.valueObject'
import { PostTitle } from '../../domain/value-objects/PostTitle.valueObject'
import { PublishedAt } from '../../domain/value-objects/PublishedAt.valueObject'
import { Slug } from '../../domain/value-objects/Slug.valueObject'
import { parseMarkdownWithFrontmatter } from './markdownFrontmatter.util'

export class PostMapper {
  static toDomain(raw: string): Post {
    const { frontmatter, body } = parseMarkdownWithFrontmatter(raw)

    return Post.create({
      slug: Slug.create(frontmatter.slug),
      title: PostTitle.create(frontmatter.title),
      excerpt: PostExcerpt.create(frontmatter.excerpt),
      content: PostContent.create(body),
      author: PostAuthor.create(frontmatter.author),
      publishedAt: PublishedAt.create(frontmatter.publishedAt),
    })
  }
}
