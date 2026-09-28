export type SymTableAppendScrollSnapshot = {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

export function snapshotSymTableAppendScroll(
  scrollEl: HTMLElement,
): SymTableAppendScrollSnapshot {
  return {
    scrollTop: scrollEl.scrollTop,
    scrollHeight: scrollEl.scrollHeight,
    clientHeight: scrollEl.clientHeight,
  }
}

/** Keep view stable after rows are appended at the bottom of the tbody. */
export function restoreSymTableAppendScroll(
  scrollEl: HTMLElement,
  snapshot: SymTableAppendScrollSnapshot,
) {
  const maxTop = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight)
  const wasNearBottom =
    snapshot.scrollHeight - snapshot.scrollTop - snapshot.clientHeight < 8

  if (wasNearBottom) {
    scrollEl.scrollTop = maxTop
    return
  }

  const delta = scrollEl.scrollHeight - snapshot.scrollHeight
  scrollEl.scrollTop = Math.min(snapshot.scrollTop + Math.max(0, delta), maxTop)
}
