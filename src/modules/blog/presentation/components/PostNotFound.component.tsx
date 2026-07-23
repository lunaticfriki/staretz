export function PostNotFound() {
  return (
    <section>
      <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Post not found</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        This post doesn't exist or may have been moved.{' '}
        <a href="/" class="text-purple-600 underline hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
          Back to all posts
        </a>
        .
      </p>
    </section>
  )
}
