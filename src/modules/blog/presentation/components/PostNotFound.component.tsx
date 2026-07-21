export function PostNotFound() {
  return (
    <section>
      <h1 class="text-2xl font-bold">Post not found</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        This post doesn't exist or may have been moved.{' '}
        <a href="/" class="underline">
          Back to all posts
        </a>
        .
      </p>
    </section>
  )
}
