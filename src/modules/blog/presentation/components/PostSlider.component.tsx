import { useLayoutEffect, useRef, useState } from 'preact/hooks'

import { gsap, prefersReducedMotion } from '../../../../shared/presentation/animation/gsap'
import { type HorizontalLoop, horizontalLoop } from '../../../../shared/presentation/animation/horizontalLoop'
import type { Post } from '../../domain/entities/Post.entity'
import { PostPreview } from './PostPreview.component'

const SLIDE_GAP_PX = 16
const SLIDE_DURATION_S = 0.8

interface PostSliderProps {
  posts: Post[]
}

export function PostSlider({ posts }: PostSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef<HorizontalLoop | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [looping, setLooping] = useState(false)
  const postsKey = posts.map((post) => post.slug.toString()).join('|')

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }

    const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'))
    const reducedMotion = prefersReducedMotion()

    const entrance = gsap.context(() => {
      if (!reducedMotion) {
        gsap.fromTo(
          '[data-slide] > *',
          { x: 80, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        )
      }
    }, track)

    if (slides.length < 2 || track.scrollWidth <= track.clientWidth) {
      setLooping(false)
      return () => entrance.revert()
    }

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      paddingRight: SLIDE_GAP_PX,
      onChange: (_element, index) => setActiveIndex(index),
    })
    loopRef.current = loop
    setLooping(true)

    return () => {
      entrance.revert()
      loop.destroy()
      loopRef.current = null
    }
  }, [postsKey])

  const duration = prefersReducedMotion() ? 0 : SLIDE_DURATION_S
  const goTo = (index: number) => loopRef.current?.toIndex(index, { duration, ease: 'power2.inOut' })

  return (
    <section aria-roledescription="carrusel" aria-label="Articles" class="mx-auto w-full max-w-6xl">
      <div
        ref={trackRef}
        class={`flex gap-4 overflow-hidden select-none ${looping ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {posts.map((post, index) => (
          <div
            key={post.slug.toString()}
            data-slide
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${posts.length}`}
            onFocusIn={() => looping && index !== loopRef.current?.current() && goTo(index)}
            class={`w-[80%] shrink-0 transition-opacity duration-500 sm:w-80 ${
              looping && index !== activeIndex ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <PostPreview post={post} />
          </div>
        ))}
      </div>

      {looping && (
        <div class="mt-4 flex items-center justify-between">
          <div class="flex gap-2">
            {posts.map((post, index) => (
              <button
                key={post.slug.toString()}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ves a l'article ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                class={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-6 bg-purple-600 dark:bg-purple-400'
                    : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <div class="flex gap-4 text-xl text-purple-600 dark:text-purple-400">
            <button
              type="button"
              onClick={() => loopRef.current?.previous({ duration, ease: 'power2.inOut' })}
              aria-label="Article anterior"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => loopRef.current?.next({ duration, ease: 'power2.inOut' })}
              aria-label="Article següent"
              class="hover:text-purple-900 dark:hover:text-purple-200"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
