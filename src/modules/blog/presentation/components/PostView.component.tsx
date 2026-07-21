import { marked } from 'marked'
import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'

interface PostViewProps {
  post: Post
}

export function PostView({ post }: PostViewProps) {
  return (
    <article>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{post.title.toString()}</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
      </p>
      <div
        class="prose prose-gray mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: marked.parse(post.content.toString()) as string }}
      />
    </article>
  )
}
