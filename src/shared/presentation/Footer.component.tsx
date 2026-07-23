export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div class="px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400">
        Staretz, <span class="text-purple-600 dark:text-purple-400">{year}</span>
      </div>
    </footer>
  )
}
