import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import type { RouteProps } from './RouteProps'
import { useAuthState } from './useAuthState.hook'

export function LoginPage(_props: RouteProps) {
  const { login } = useAuthState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: Event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      route('/dashboard')
    } catch {
      setError('Correu electrònic o contrasenya incorrectes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section class="mx-auto w-full max-w-lg">
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Inicia sessió</h1>
      <form onSubmit={handleSubmit} class="mt-6 flex flex-col gap-4">
        <label class="flex flex-col gap-1 text-sm">
          Correu electrònic
          <input
            type="email"
            required
            value={email}
            onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
            class="rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-700"
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Contrasenya
          <input
            type="password"
            required
            value={password}
            onInput={(event) => setPassword((event.target as HTMLInputElement).value)}
            class="rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-700"
          />
        </label>
        {error && <p class="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          class="rounded bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50 dark:bg-purple-400 dark:text-black"
        >
          {submitting ? 'Entrant...' : 'Entra'}
        </button>
      </form>
    </section>
  )
}
