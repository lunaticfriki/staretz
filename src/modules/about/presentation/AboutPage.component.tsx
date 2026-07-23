import type { RouteProps } from '../../../shared/presentation/RouteProps'

export function AboutPage(_props: RouteProps) {
  return (
    <section class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">About Staretz</h1>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        Staretz is a small blog about software architecture, built with Preact, TypeScript, and
        Tailwind CSS, following a domain-driven, hexagonal architecture with CQRS and vertical
        slicing.
      </p>
    </section>
  )
}
