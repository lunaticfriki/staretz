export function PostViewSkeleton() {
  return (
    <div class="animate-pulse">
      <div class="-mx-4 -mt-4 flex h-[calc(100dvh-var(--header-height))] items-end bg-gray-200 px-4 pb-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:bg-gray-800">
        <div class="h-16 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
      <div class="mx-auto max-w-3xl py-8">
        <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="mt-8 space-y-3">
          <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
