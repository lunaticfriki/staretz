import type { RouteProps } from './RouteProps'

export function NotFoundPage(_props: RouteProps) {
  return (
    <section class="mx-auto w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Pàgina no trobada</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        La pàgina que cerques no existeix.{' '}
        <a href="/" class="text-purple-600 underline hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
          Torna a l'inici
        </a>
        .
      </p>
    </section>
  )
}
