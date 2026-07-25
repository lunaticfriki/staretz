import type { RouteProps } from '../../../shared/presentation/RouteProps'

export function AboutPage(_props: RouteProps) {
  return (
    <section class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Quant a Staretz</h1>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        Staretz és un petit blog sobre arquitectura de programari, construït amb Preact, TypeScript
        i Tailwind CSS, seguint una arquitectura hexagonal orientada al domini amb CQRS i tallat
        vertical.
      </p>
    </section>
  )
}
