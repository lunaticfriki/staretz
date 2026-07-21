export function Header() {
  return (
    <header class="border-b border-gray-200 dark:border-gray-800">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <a href="/" class="text-lg font-bold text-gray-900 dark:text-gray-100">
          Staretz
        </a>
        <nav class="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          <a href="/" class="hover:text-gray-900 dark:hover:text-gray-100">
            Home
          </a>
          <a href="/about" class="hover:text-gray-900 dark:hover:text-gray-100">
            About
          </a>
        </nav>
      </div>
    </header>
  )
}
