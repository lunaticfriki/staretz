import { Page } from '../../../../shared/pagination/domain/value-objects/Page.valueObject'
import type { PaginationCriteria } from '../../../../shared/pagination/domain/value-objects/PaginationCriteria.valueObject'
import type { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { CategoryCollection } from './Category.collection'
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

  filterByCategory(criteria: SearchCriteria): PostCollection {
    return PostCollection.create(this.posts.filter((post) => criteria.matches(post.category.toString())))
  }

  categories(): CategoryCollection {
    const unique = new Map(this.posts.map((post) => [post.category.toString().toLowerCase(), post.category]))
    const sorted = [...unique.values()].sort((a, b) => a.toString().localeCompare(b.toString()))
    return CategoryCollection.create(sorted)
  }

  paginate(criteria: PaginationCriteria): Page<Post> {
    const items = this.posts.slice(criteria.offset, criteria.offset + criteria.perPage)
    return Page.create({ items, criteria, totalItems: this.posts.length })
  }

  toArray(): Post[] {
    return [...this.posts]
  }
}
