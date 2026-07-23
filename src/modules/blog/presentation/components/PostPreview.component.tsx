import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'

interface PostPreviewProps {
  post: Post
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <article class="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700">
      <a href={`/blog/${post.slug}`} class="block">
        <h2 class="line-clamp-2 text-lg font-semibold text-purple-700 dark:text-purple-400">
          {post.title.toString()}
        </h2>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
        </p>
        <p class="mt-2 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">{post.excerpt.toString()}</p>
      </a>
    </article>
  )
}
