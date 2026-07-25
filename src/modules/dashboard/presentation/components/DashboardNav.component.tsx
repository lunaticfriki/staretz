interface DashboardNavProps {
  onLogout: () => void
}

export function DashboardNav({ onLogout }: DashboardNavProps) {
  return (
    <div class="flex items-center justify-between border-b border-gray-200 pb-4 text-sm dark:border-gray-800">
      <nav class="flex gap-4">
        <a href="/dashboard" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200">
          Articles
        </a>
        <a
          href="/dashboard/new"
          class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
        >
          Nou article
        </a>
      </nav>
      <button
        type="button"
        onClick={onLogout}
        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
      >
        Tanca sessió
      </button>
    </div>
  )
}
