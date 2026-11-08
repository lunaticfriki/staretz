import Lenis from 'lenis'
import { useEffect, useRef } from 'preact/hooks'

import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

/**
 * Enables Lenis smooth scrolling for the whole page and keeps GSAP's
 * ScrollTrigger in sync with it. Returns a function that jumps to the top,
 * used on route changes.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }

    const lenis = new Lenis({ autoRaf: false })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return function scrollToTop() {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }
}
