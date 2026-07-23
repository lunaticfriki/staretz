import type { RouteProps } from './RouteProps'

export function NotFoundPage(_props: RouteProps) {
  return (
    <section class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Page not found</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        The page you're looking for doesn't exist.{' '}
        <a href="/" class="text-purple-600 underline hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
          Go back home
        </a>
        .
      </p>
    </section>
  )
}
