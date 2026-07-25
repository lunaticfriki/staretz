import { marked } from 'marked'
import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'
import { postImageUrl } from '../postImageUrl.util'

interface PostViewProps {
  post: Post
}

export function PostView({ post }: PostViewProps) {
  return (
    <article>
      <div class="relative -mx-4 -mt-4 flex h-[calc(100dvh-var(--header-height))] items-end sm:-mx-6 lg:-mx-8">
        <img
          src={postImageUrl(post.slug, 1600, 900)}
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
        <a href="/" class="absolute top-6 left-4 z-10 text-sm text-white/90 hover:text-white sm:left-6 lg:left-8">
          ← Torna a tots els articles
        </a>
        <div class="relative z-10 px-4 pb-12 sm:px-6 lg:px-8">
          <p class="text-sm font-semibold tracking-wide text-white/80 uppercase">{post.category.toString()}</p>
          <h1 class="mt-2 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">{post.title.toString()}</h1>
        </div>
      </div>
      <div class="mx-auto max-w-3xl py-8">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
        </p>
        <div
          class="prose prose-gray mt-8 max-w-none prose-headings:text-purple-700 prose-a:text-purple-600 dark:prose-invert dark:prose-headings:text-purple-400 dark:prose-a:text-purple-400"
          dangerouslySetInnerHTML={{ __html: marked.parse(post.content.toString()) as string }}
        />
      </div>
    </article>
  )
}
