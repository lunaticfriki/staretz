import { useState } from 'preact/hooks'
import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { useAuthState } from '../../../../shared/presentation/useAuthState.hook'
import { Pagination } from '../../../../shared/presentation/Pagination.component'
import { SortCriteria } from '../../../../shared/sorting/domain/value-objects/SortCriteria.valueObject'
import type { PostSortField } from '../../../blog/domain/collections/Post.collection'
import { usePostsPageState } from '../../../blog/presentation/usePostsPageState.hook'
import { usePostManagementState } from '../usePostManagementState.hook'
import { DashboardNav } from '../components/DashboardNav.component'
import { PostsTable } from '../components/PostsTable.component'
import { PostsSearch } from '../components/PostsSearch.component'

const POSTS_PER_PAGE = 5

export function PostsListContainer(_props: RouteProps) {
  const { logout } = useAuthState()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortCriteria<PostSortField>>(SortCriteria.none())
  const [refreshToken, setRefreshToken] = useState(0)
  const state = usePostsPageState(page, POSTS_PER_PAGE, search, sort, refreshToken)
  const { delete: deleteState, deletePost } = usePostManagementState()

  function handleSearchChange(term: string) {
    setSearch(term)
    setPage(1)
  }

  function handleSortChange(nextSort: SortCriteria<PostSortField>) {
    setSort(nextSort)
    setPage(1)
  }

  async function handleDelete(slug: string) {
    if (!window.confirm(`Segur que vols eliminar "${slug}"? Aquesta acció no es pot desfer.`)) {
      return
    }

    await deletePost(slug)
    setRefreshToken((token) => token + 1)
  }

  return (
    <section class="w-full">
      <DashboardNav onLogout={logout} />
      <div class="mt-6 flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Articles</h1>
        <PostsSearch onSearch={handleSearchChange} />
      </div>
      {state.status === 'loading' && <p class="mt-6 text-gray-500 dark:text-gray-400">Carregant...</p>}
      {state.status === 'error' && <p class="mt-6 text-red-600 dark:text-red-400">{state.message}</p>}
      {state.status === 'loaded' && (
        <div class="mt-6">
          <PostsTable
            posts={state.page.items}
            deletingSlug={deleteState.status === 'deleting' ? deleteState.slug : null}
            onDelete={handleDelete}
            sort={sort}
            onSortChange={handleSortChange}
            emptyMessage={search ? `No s'han trobat articles per a "${search}".` : 'Encara no hi ha cap article.'}
          />
          <Pagination page={state.page.page} totalPages={state.page.totalPages} onPageChange={setPage} />
        </div>
      )}
    </section>
  )
}
