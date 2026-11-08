import type { RefObject } from 'preact'
import { type Inputs, useLayoutEffect } from 'preact/hooks'

import { FULL_MOTION_QUERY, gsap } from './gsap'

export function useGsap(
  scope: RefObject<Element>,
  setup: (context: { scope: Element }) => void,
  inputs: Inputs = [],
) {
  useLayoutEffect(() => {
    const element = scope.current
    if (!element) {
      return
    }

    const mm = gsap.matchMedia(element)
    mm.add(FULL_MOTION_QUERY, () => setup({ scope: element }))
    return () => mm.revert()
  }, inputs)
}
