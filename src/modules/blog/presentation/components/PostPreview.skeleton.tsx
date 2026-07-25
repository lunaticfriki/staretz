export function PostPreviewSkeleton() {
  return (
    <div class="animate-pulse overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div class="h-40 w-full bg-gray-200 dark:bg-gray-800" />
      <div class="p-4">
        <div class="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="mt-2 h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="mt-2 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="mt-3 h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div class="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  )
}
