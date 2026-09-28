export type SymTableAppendScrollSnapshot = {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  /** Ease scroll when restoring after explicit load-more (not autofill). */
  animate?: boolean
}

let activeAnimation: { cancel: () => void } | null = null

function readMotionDurationMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--core-motion-duration-slow')
    .trim()
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 280
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Matches --core-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1) (ease-out). */
function easeStandardOut(t: number): number {
  const u = 1 - t
  return 1 - u * u * u
}

export function snapshotSymTableAppendScroll(
  scrollEl: HTMLElement,
  options: { animate?: boolean } = {},
): SymTableAppendScrollSnapshot {
  return {
    scrollTop: scrollEl.scrollTop,
    scrollHeight: scrollEl.scrollHeight,
    clientHeight: scrollEl.clientHeight,
    animate: options.animate === true,
  }
}

function animateScrollTopTo(
  scrollEl: HTMLElement,
  fromTop: number,
  targetTop: number,
  onDone: () => void,
) {
  activeAnimation?.cancel()
  activeAnimation = null

  if (Math.abs(fromTop - targetTop) < 1) {
    scrollEl.scrollTop = targetTop
    onDone()
    return
  }

  scrollEl.scrollTop = fromTop
  const duration = readMotionDurationMs()
  const start = performance.now()

  let frame = 0
  let lastAppliedTop = fromTop
  let finished = false

  const finish = () => {
    if (finished) return
    finished = true
    if (frame) cancelAnimationFrame(frame)
    scrollEl.removeEventListener('wheel', onUserIntent)
    scrollEl.removeEventListener('touchstart', onUserIntent)
    scrollEl.removeEventListener('keydown', onUserIntent)
    scrollEl.removeEventListener('scroll', onScrollWhileAnimating)
    activeAnimation = null
    onDone()
  }

  const onUserIntent = () => finish()

  const onScrollWhileAnimating = () => {
    if (Math.abs(scrollEl.scrollTop - lastAppliedTop) > 3) {
      finish()
    }
  }

  scrollEl.addEventListener('wheel', onUserIntent, { passive: true })
  scrollEl.addEventListener('touchstart', onUserIntent, { passive: true })
  scrollEl.addEventListener('keydown', onUserIntent)
  scrollEl.addEventListener('scroll', onScrollWhileAnimating, { passive: true })

  const step = (now: number) => {
    if (finished) return
    const t = Math.min(1, (now - start) / duration)
    lastAppliedTop = fromTop + (targetTop - fromTop) * easeStandardOut(t)
    scrollEl.scrollTop = lastAppliedTop
    if (t < 1) {
      frame = requestAnimationFrame(step)
    } else {
      finish()
    }
  }

  activeAnimation = { cancel: finish }
  frame = requestAnimationFrame(step)
}

/** Keep view stable after rows are appended at the bottom of the tbody. */
export function restoreSymTableAppendScroll(
  scrollEl: HTMLElement,
  snapshot: SymTableAppendScrollSnapshot,
  onComplete?: () => void,
) {
  const done = () => onComplete?.()

  const maxTop = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight)
  const hadOverflow = snapshot.scrollHeight > snapshot.clientHeight + 1

  const delta = scrollEl.scrollHeight - snapshot.scrollHeight

  if (!hadOverflow) {
    const revealTarget = Math.min(maxTop, Math.max(0, delta))
    const shouldRevealAnimate =
      snapshot.animate === true &&
      !prefersReducedMotion() &&
      revealTarget > 1

    if (shouldRevealAnimate) {
      animateScrollTopTo(scrollEl, snapshot.scrollTop, revealTarget, done)
      return
    }

    scrollEl.scrollTop = 0
    done()
    return
  }

  const distanceFromBottom =
    snapshot.scrollHeight - snapshot.scrollTop - snapshot.clientHeight

  let targetTop: number
  if (distanceFromBottom < 8) {
    targetTop = maxTop
  } else {
    targetTop = Math.min(snapshot.scrollTop + Math.max(0, delta), maxTop)
  }

  const shouldAnimate =
    snapshot.animate === true &&
    !prefersReducedMotion() &&
    Math.abs(targetTop - snapshot.scrollTop) > 1

  if (shouldAnimate) {
    animateScrollTopTo(scrollEl, snapshot.scrollTop, targetTop, done)
    return
  }

  activeAnimation?.cancel()
  activeAnimation = null
  scrollEl.scrollTop = targetTop
  done()
}
