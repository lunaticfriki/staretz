import { PostPreviewSkeleton } from './PostPreview.skeleton'

interface PostSliderSkeletonProps {
  count: number
}

export function PostSliderSkeleton({ count }: PostSliderSkeletonProps) {
  return (
    <div class="mx-auto flex w-full max-w-6xl gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} class="w-[80%] shrink-0 sm:w-80">
          <PostPreviewSkeleton />
        </div>
      ))}
    </div>
  )
}
