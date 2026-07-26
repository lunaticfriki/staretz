import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { LatestPosts } from './LatestPosts.container'

export function HomeContainer(_props: RouteProps) {
  return (
    <div>
      <div class="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Últims articles</h1>
        <a href="/blog" class="text-sm text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200">
          Veure tots els articles →
        </a>
      </div>
      <LatestPosts />
    </div>
  )
}
