import { PostAuthor } from '../value-objects/PostAuthor.valueObject'
import { PostContent } from '../value-objects/PostContent.valueObject'
import { PostExcerpt } from '../value-objects/PostExcerpt.valueObject'
import { PostTitle } from '../value-objects/PostTitle.valueObject'
import { PublishedAt } from '../value-objects/PublishedAt.valueObject'
import { Slug } from '../value-objects/Slug.valueObject'

interface CreatePostParams {
  slug: Slug
  title: PostTitle
  excerpt: PostExcerpt
  content: PostContent
  author: PostAuthor
  publishedAt: PublishedAt
}

export class Post {
  private constructor(
    public readonly slug: Slug,
    public readonly title: PostTitle,
    public readonly excerpt: PostExcerpt,
    public readonly content: PostContent,
    public readonly author: PostAuthor,
    public readonly publishedAt: PublishedAt,
  ) {}

  static create(params: CreatePostParams): Post {
    return new Post(
      params.slug,
      params.title,
      params.excerpt,
      params.content,
      params.author,
      params.publishedAt,
    )
  }

  static empty(): Post {
    return new Post(
      Slug.empty(),
      PostTitle.empty(),
      PostExcerpt.empty(),
      PostContent.empty(),
      PostAuthor.empty(),
      PublishedAt.empty(),
    )
  }
}
