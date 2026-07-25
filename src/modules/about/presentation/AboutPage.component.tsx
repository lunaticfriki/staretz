import type { RouteProps } from '../../../shared/presentation/RouteProps'

export function AboutPage(_props: RouteProps) {
  return (
    <section class="mx-auto flex max-w-3xl flex-1 flex-col justify-center">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">
        Sobre Staretz
      </h1>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        Staretz és un projecte random en català on trobaràs opinions sobre
        qualsevol tema que no t'interessi.
      </p>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        Versió: <span class="text-purple-400 pl-2">1.0.0</span>
      </p>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        Autor: <span class="text-purple-400 pl-2">Vania</span>
      </p>
    </section>
  )
}
