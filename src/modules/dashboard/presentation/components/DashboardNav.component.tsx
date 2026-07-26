import { useRouter } from 'preact-router'

interface DashboardNavProps {
  onLogout: () => void
}

function navLinkClass(active: boolean) {
  return active ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-900 dark:hover:text-purple-200'
}

export function DashboardNav({ onLogout }: DashboardNavProps) {
  const [router] = useRouter()
  const currentPath = router.url.split('?')[0]
  const isArticles = currentPath === '/dashboard'
  const isNewPost = currentPath === '/dashboard/new'

  return (
    <div class="flex items-center justify-between border-b border-gray-200 pb-4 text-sm dark:border-gray-800">
      <nav class="flex gap-4">
        <a href="/dashboard" aria-current={isArticles ? 'page' : undefined} class={navLinkClass(isArticles)}>
          Articles
        </a>
        <a href="/dashboard/new" aria-current={isNewPost ? 'page' : undefined} class={navLinkClass(isNewPost)}>
          Nou article
        </a>
      </nav>
      <button type="button" onClick={onLogout} class="hover:text-purple-900 dark:hover:text-purple-200">
        Tanca sessió
      </button>
    </div>
  )
}
