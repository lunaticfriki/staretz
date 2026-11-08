import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

import { gsap } from './gsap'

gsap.registerPlugin(Draggable, InertiaPlugin)

export interface HorizontalLoopConfig {
  /** Pixels per second multiplier (1 = 100px/s). */
  speed?: number
  paused?: boolean
  repeat?: number
  /** Extra space after the last item, usually the gap between items. */
  paddingRight?: number
  snap?: number | false
  draggable?: boolean
  onChange?: (element: HTMLElement, index: number) => void
}

export interface HorizontalLoop {
  timeline: gsap.core.Timeline
  next: (vars?: gsap.TweenVars) => void
  previous: (vars?: gsap.TweenVars) => void
  toIndex: (index: number, vars?: gsap.TweenVars) => void
  current: () => number
  destroy: () => void
}

/**
 * Seamless, draggable horizontal loop of `items` — adapted from GreenSock's
 * `horizontalLoop` helper (https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop).
 * Items are moved with xPercent so the layout (and hit-testing) stays intact.
 */
export function horizontalLoop(items: HTMLElement[], config: HorizontalLoopConfig = {}): HorizontalLoop {
  const { onChange } = config
  const length = items.length
  const container = items[0].parentElement as HTMLElement
  const pixelsPerSecond = (config.speed ?? 1) * 100
  const snap = config.snap === false ? (value: number) => value : gsap.utils.snap(config.snap || 1)
  const times: number[] = []
  const widths: number[] = []
  const spaceBefore: number[] = []
  const xPercents: number[] = []
  let lastIndex = 0
  let curIndex = 0
  let indexIsDirty = false
  let totalWidth = 0
  let timeWrap: (value: number) => number = (value) => value
  let draggable: Draggable | undefined
  const proxy = document.createElement('div')

  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onUpdate: () => {
      if (!onChange) {
        return
      }
      const index = closestIndex()
      if (lastIndex !== index) {
        lastIndex = index
        onChange(items[index], index)
      }
    },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    },
  })

  const startX = items[0].offsetLeft

  const getTotalWidth = () =>
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    spaceBefore[0] +
    items[length - 1].offsetWidth * Number(gsap.getProperty(items[length - 1], 'scaleX')) +
    (config.paddingRight ?? 0)

  const populateWidths = () => {
    let previous = container.getBoundingClientRect()
    items.forEach((element, i) => {
      widths[i] = parseFloat(String(gsap.getProperty(element, 'width', 'px')))
      xPercents[i] = snap(
        (parseFloat(String(gsap.getProperty(element, 'x', 'px'))) / widths[i]) * 100 +
          Number(gsap.getProperty(element, 'xPercent')),
      )
      const bounds = element.getBoundingClientRect()
      spaceBefore[i] = bounds.left - (i ? previous.right : previous.left)
      previous = bounds
    })
    gsap.set(items, { xPercent: (i: number) => xPercents[i] })
    totalWidth = getTotalWidth()
  }

  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length
    let closest = 1e10
    let index = 0
    while (i--) {
      let distance = Math.abs(values[i] - value)
      if (distance > wrap / 2) {
        distance = wrap - distance
      }
      if (distance < closest) {
        closest = distance
        index = i
      }
    }
    return index
  }

  const populateTimeline = () => {
    tl.clear()
    for (let i = 0; i < length; i++) {
      const item = items[i]
      const curX = (xPercents[i] / 100) * widths[i]
      const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0]
      const distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, 'scaleX'))
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0,
      )
        .fromTo(
          item,
          { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
          {
            xPercent: xPercents[i],
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond,
        )
        .add(`label${i}`, distanceToStart / pixelsPerSecond)
      times[i] = distanceToStart / pixelsPerSecond
    }
    timeWrap = gsap.utils.wrap(0, tl.duration())
  }

  const refresh = (deep = false) => {
    const progress = tl.progress()
    tl.progress(0, true)
    populateWidths()
    if (deep) {
      populateTimeline()
    }
    if (deep && draggable) {
      tl.time(times[curIndex], true)
    } else {
      tl.progress(progress, true)
    }
  }

  const onResize = () => refresh(true)

  function closestIndex(setCurrent = false) {
    const index = getClosest(times, tl.time(), tl.duration())
    if (setCurrent) {
      curIndex = index
      indexIsDirty = false
    }
    return index
  }

  const current = () => (indexIsDirty ? closestIndex(true) : curIndex)

  function toIndex(target: number, vars: gsap.TweenVars = {}) {
    let index = target
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length
    }
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = { time: timeWrap }
    }
    curIndex = newIndex
    vars.overwrite = true
    gsap.killTweensOf(proxy)
    if (vars.duration === 0) {
      tl.time(timeWrap(time))
    } else {
      tl.tweenTo(time, vars)
    }
  }

  gsap.set(items, { x: 0 })
  populateWidths()
  populateTimeline()
  window.addEventListener('resize', onResize)
  tl.progress(1, true).progress(0, true)

  if (config.draggable) {
    const wrap = gsap.utils.wrap(0, 1)
    let ratio = 0
    let startProgress = 0
    let lastSnap = 0
    let initChangeX = 0
    let wasPlaying = false

    const align = () => {
      if (draggable) {
        tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio))
      }
    }
    const syncIndex = () => closestIndex(true)

    draggable = Draggable.create(proxy, {
      trigger: container,
      type: 'x',
      dragClickables: true,
      inertia: true,
      overshootTolerance: 0,
      onPressInit(this: Draggable) {
        const x = this.x
        gsap.killTweensOf(tl)
        wasPlaying = !tl.paused()
        tl.pause()
        startProgress = tl.progress()
        refresh()
        ratio = 1 / totalWidth
        initChangeX = startProgress / -ratio - x
        gsap.set(proxy, { x: startProgress / -ratio })
      },
      onDrag: align,
      onThrowUpdate: align,
      snap(this: Draggable, value: number) {
        if (Math.abs(startProgress / -ratio - this.x) < 10) {
          return lastSnap + initChangeX
        }
        const time = -(value * ratio) * tl.duration()
        const wrappedTime = timeWrap(time)
        const snapTime = times[getClosest(times, wrappedTime, tl.duration())]
        let difference = snapTime - wrappedTime
        if (Math.abs(difference) > tl.duration() / 2) {
          difference += difference < 0 ? tl.duration() : -tl.duration()
        }
        lastSnap = (time + difference) / tl.duration() / -ratio
        return lastSnap
      },
      onRelease() {
        syncIndex()
        if (draggable?.isThrowing) {
          indexIsDirty = true
        }
      },
      onThrowComplete() {
        syncIndex()
        if (wasPlaying) {
          tl.play()
        }
      },
    })[0]
  }

  closestIndex(true)
  lastIndex = curIndex
  onChange?.(items[curIndex], curIndex)

  return {
    timeline: tl,
    next: (vars) => toIndex(current() + 1, vars),
    previous: (vars) => toIndex(current() - 1, vars),
    toIndex,
    current,
    destroy: () => {
      window.removeEventListener('resize', onResize)
      draggable?.kill()
      tl.kill()
      gsap.set(items, { clearProps: 'transform' })
    },
  }
}
