import { Post } from '../Post.entity'
import { Category } from '../../value-objects/Category.valueObject'
import { PostAuthor } from '../../value-objects/PostAuthor.valueObject'
import { PostContent } from '../../value-objects/PostContent.valueObject'
import { PostExcerpt } from '../../value-objects/PostExcerpt.valueObject'
import { PostImage } from '../../value-objects/PostImage.valueObject'
import { PostTitle } from '../../value-objects/PostTitle.valueObject'
import { PublishedAt } from '../../value-objects/PublishedAt.valueObject'
import { Slug } from '../../value-objects/Slug.valueObject'

export class PostMother {
  static random(): Post {
    return Post.create({
      slug: Slug.create('sample-post'),
      title: PostTitle.create('Sample Post'),
      excerpt: PostExcerpt.create('A sample excerpt used for tests.'),
      content: PostContent.create('Sample post body content.'),
      author: PostAuthor.create('Jane Doe'),
      publishedAt: PublishedAt.create(new Date('2026-01-01T00:00:00Z')),
      category: Category.create('Architecture'),
      image: PostImage.create('https://picsum.photos/seed/sample-post/1200/800'),
    })
  }

  static empty(): Post {
    return Post.empty()
  }

  static withSlug(slug: string): Post {
    return Post.create({
      slug: Slug.create(slug),
      title: PostTitle.create('Sample Post'),
      excerpt: PostExcerpt.create('A sample excerpt used for tests.'),
      content: PostContent.create('Sample post body content.'),
      author: PostAuthor.create('Jane Doe'),
      publishedAt: PublishedAt.create(new Date('2026-01-01T00:00:00Z')),
      category: Category.create('Architecture'),
      image: PostImage.create(`https://picsum.photos/seed/${slug}/1200/800`),
    })
  }

  static publishedAt(date: Date): Post {
    return Post.create({
      slug: Slug.create('sample-post'),
      title: PostTitle.create('Sample Post'),
      excerpt: PostExcerpt.create('A sample excerpt used for tests.'),
      content: PostContent.create('Sample post body content.'),
      author: PostAuthor.create('Jane Doe'),
      publishedAt: PublishedAt.create(date),
      category: Category.create('Architecture'),
      image: PostImage.create('https://picsum.photos/seed/sample-post/1200/800'),
    })
  }

  static category(category: string): Post {
    return Post.create({
      slug: Slug.create('sample-post'),
      title: PostTitle.create('Sample Post'),
      excerpt: PostExcerpt.create('A sample excerpt used for tests.'),
      content: PostContent.create('Sample post body content.'),
      author: PostAuthor.create('Jane Doe'),
      publishedAt: PublishedAt.create(new Date('2026-01-01T00:00:00Z')),
      category: Category.create(category),
      image: PostImage.create('https://picsum.photos/seed/sample-post/1200/800'),
    })
  }

  static titled(title: string): Post {
    return Post.create({
      slug: Slug.create('sample-post'),
      title: PostTitle.create(title),
      excerpt: PostExcerpt.create('A sample excerpt used for tests.'),
      content: PostContent.create('Sample post body content.'),
      author: PostAuthor.create('Jane Doe'),
      publishedAt: PublishedAt.create(new Date('2026-01-01T00:00:00Z')),
      category: Category.create('Architecture'),
      image: PostImage.create('https://picsum.photos/seed/sample-post/1200/800'),
    })
  }
}
