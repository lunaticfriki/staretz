import { useRef } from 'preact/hooks'
import { gsap } from '../../../../shared/presentation/animation/gsap'
import { useGsap } from '../../../../shared/presentation/animation/useGsap.hook'
import type { Post } from '../../domain/entities/Post.entity'
import { formatPublishedAt } from '../formatPublishedAt.util'
import { marked } from 'marked'

interface PostViewProps {
  post: Post
}

export function PostView({ post }: PostViewProps) {
  const articleRef = useRef<HTMLElement>(null)

  useGsap(
    articleRef,
    () => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-anim="hero-image"]', { scale: 1.15, autoAlpha: 0, duration: 1.4 })
        .from('[data-anim="hero-text"] > *', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, '-=0.9')
        .from('[data-anim="back"]', { x: -16, autoAlpha: 0, duration: 0.6 }, '-=0.6')
        .from('[data-anim="body"]', { y: 24, autoAlpha: 0, duration: 0.8 }, '-=0.5')

      gsap.to('[data-anim="hero-image"]', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: '[data-anim="hero"]', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-anim="hero-text"]', {
        yPercent: -30,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: '[data-anim="hero"]', start: 'center center', end: 'bottom top', scrub: true },
      })
    },
    [post.slug.toString()],
  )

  return (
    <article ref={articleRef}>
      <div data-anim="hero" class="relative -mx-2 -mt-2 flex overflow-hidden h-[calc(100dvh-var(--header-height))] items-end sm:-mx-6 lg:-mx-8">
        <img
          src={post.image.toString()}
          alt=""
          data-anim="hero-image"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
        <a
          href="/"
          data-anim="back"
          class="absolute top-6 left-4 z-10 text-sm text-white/90 hover:text-white sm:left-6 lg:left-8"
        >
          ← Torna a tots els articles
        </a>
        <div data-anim="hero-text" class="relative z-10 px-4 pb-12 sm:px-6 lg:px-8">
          <p class="text-sm font-semibold tracking-wide text-white/80 uppercase">
            {post.category.toString()}
          </p>
          <h1 class="mt-2 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            {post.title.toString()}
          </h1>
        </div>
      </div>
      <div data-anim="body" class="mx-auto max-w-3xl py-8">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {post.author.toString()} · {formatPublishedAt(post.publishedAt)}
        </p>
        <div
          class="prose prose-gray mt-8 max-w-none prose-headings:text-purple-700 prose-a:text-purple-600 dark:prose-invert dark:prose-headings:text-purple-400 dark:prose-a:text-purple-400"
          dangerouslySetInnerHTML={{
            __html: marked.parse(post.content.toString()) as string,
          }}
        />
      </div>
    </article>
  )
}
