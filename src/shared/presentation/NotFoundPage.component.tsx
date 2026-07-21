import type { RouteProps } from './RouteProps'

export function NotFoundPage(_props: RouteProps) {
  return (
    <section>
      <h1 class="text-2xl font-bold">Page not found</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        The page you're looking for doesn't exist.{' '}
        <a href="/" class="underline">
          Go back home
        </a>
        .
      </p>
    </section>
  )
}
