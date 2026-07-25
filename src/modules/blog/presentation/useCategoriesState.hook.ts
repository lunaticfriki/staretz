import { useEffect } from 'preact/hooks'
import { container } from '../../../composition-root'
import type { CategoriesState, PostStateService } from '../application/Post.stateService'
import { ListCategoriesQuery } from '../application/query/ListCategories.query'
import { TYPES } from '../../../shared/di/types'

export function useCategoriesState(): CategoriesState {
  const postStateService = container.get<PostStateService>(TYPES.PostStateService)

  useEffect(() => {
    postStateService.loadCategories(new ListCategoriesQuery())
  }, [])

  return postStateService.categories.value
}
