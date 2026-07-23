import { marked } from 'marked'
import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'

interface PostViewProps {
  post: Post
}

export function PostView({ post }: PostViewProps) {
  return (
    <article>
      <h1 class="text-3xl font-bold text-purple-700 dark:text-purple-400">{post.title.toString()}</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
      </p>
      <div
        class="prose prose-gray mt-8 max-w-none prose-headings:text-purple-700 prose-a:text-purple-600 dark:prose-invert dark:prose-headings:text-purple-400 dark:prose-a:text-purple-400"
        dangerouslySetInnerHTML={{ __html: marked.parse(post.content.toString()) as string }}
      />
    </article>
  )
}
