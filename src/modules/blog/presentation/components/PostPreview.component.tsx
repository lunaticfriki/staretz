import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'
import { postImageUrl } from '../postImageUrl.util'

interface PostPreviewProps {
  post: Post
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <article class="overflow-hidden rounded-lg border border-gray-200 transition hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700">
      <a href={`/blog/${post.slug}`} class="block">
        <img
          src={postImageUrl(post.slug, 480, 240)}
          alt=""
          loading="lazy"
          class="h-40 w-full object-cover"
        />
        <div class="p-4">
          <p class="text-xs font-semibold tracking-wide text-purple-500 uppercase dark:text-purple-400">
            {post.category.toString()}
          </p>
          <h2 class="mt-1 line-clamp-2 min-h-14 text-lg font-semibold text-purple-700 dark:text-purple-400">
            {post.title.toString()}
          </h2>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
          </p>
          <p class="mt-2 line-clamp-2 min-h-10 text-sm text-gray-700 dark:text-gray-300">
            {post.excerpt.toString()}
          </p>
        </div>
      </a>
    </article>
  )
}
