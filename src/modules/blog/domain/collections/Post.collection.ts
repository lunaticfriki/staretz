import { Post } from '../entities/Post.entity'

export class PostCollection {
  private constructor(private readonly posts: Post[]) {}

  static create(posts: Post[]): PostCollection {
    return new PostCollection(posts)
  }

  get length(): number {
    return this.posts.length
  }

  sortedByMostRecent(): PostCollection {
    return PostCollection.create([...this.posts].sort((a, b) => (a.publishedAt.isAfter(b.publishedAt) ? -1 : 1)))
  }

  take(limit: number): PostCollection {
    return PostCollection.create(this.posts.slice(0, limit))
  }

  toArray(): Post[] {
    return [...this.posts]
  }
}
