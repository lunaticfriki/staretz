export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer class="sticky bottom-0 bg-background">
      <div class="flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Staretz,{' '}
          <span class="text-purple-600 dark:text-purple-400">{year}</span>
        </div>

        <div class="border border-gray-200 dark:border-gray-800">
          <img
            src="/logo-title-black.jpg"
            alt="Staretz"
            class="h-20 w-auto invert dark:invert-0"
          />
        </div>
      </div>
    </footer>
  )
}
