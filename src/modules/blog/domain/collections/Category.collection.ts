import type { SearchCriteria } from '../../../../shared/search/domain/value-objects/SearchCriteria.valueObject'
import { Category } from '../value-objects/Category.valueObject'

export class CategoryCollection {
  private constructor(private readonly categories: Category[]) {}

  static create(categories: Category[]): CategoryCollection {
    return new CategoryCollection(categories)
  }

  get length(): number {
    return this.categories.length
  }

  matching(criteria: SearchCriteria): CategoryCollection {
    return CategoryCollection.create(this.categories.filter((category) => criteria.matches(category.toString())))
  }

  toArray(): Category[] {
    return [...this.categories]
  }
}
