import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import {
  restoreSymTableAppendScroll,
  snapshotSymTableAppendScroll,
  type SymTableAppendScrollSnapshot,
} from './symTableAppendScroll'
import {
  useSymTableCardScrollLayout,
  type SymTableScrollMetrics,
} from './useSymTableCardScrollLayout'

export const SYM_TABLE_PROGRESSIVE_PAGE_SIZE = 20
const SCROLL_LOAD_THRESHOLD_PX = 96
const SCROLL_LOAD_REARM_PX = 120

type RowWithId = { id: string }

/**
 * Progressive table load: viewport autofill, +20 batches, scroll/wheel near-bottom load,
 * append scroll restore + animation. Use with SymTableCardSplitScroll + table dashboard layout.
 */
export function useSymTableProgressiveLoad<T extends RowWithId>(
  catalog: T[],
  tablePanelRef: RefObject<HTMLElement | null>,
  tableScrollRef: RefObject<HTMLDivElement | null>,
  filterResetDeps: unknown[],
) {
  const [visibleCount, setVisibleCount] = useState(SYM_TABLE_PROGRESSIVE_PAGE_SIZE)
  const [scrollMetrics, setScrollMetrics] = useState<SymTableScrollMetrics | null>(null)
  const appendScrollSnapshotRef = useRef<SymTableAppendScrollSnapshot | null>(null)
  const loadMoreInFlightRef = useRef(false)
  const suppressScrollLoadRef = useRef(false)
  const scrollLoadArmedRef = useRef(true)
  const viewportFilledRef = useRef(false)
  const userExpandedRef = useRef(false)
  const pinScrollTopRef = useRef(false)
  const [appendingRowIds, setAppendingRowIds] = useState<ReadonlySet<string>>(() => new Set())
  const visibleCountRef = useRef(visibleCount)
  visibleCountRef.current = visibleCount

  const visibleRows = catalog.slice(0, Math.min(visibleCount, catalog.length))
  const hasMoreRows = visibleCount < catalog.length

  useSymTableCardScrollLayout(tablePanelRef, tableScrollRef, [hasMoreRows], {
    fillViewport: hasMoreRows,
    onMetrics: setScrollMetrics,
  })

  useEffect(() => {
    scrollLoadArmedRef.current = true
    viewportFilledRef.current = false
    userExpandedRef.current = false
    pinScrollTopRef.current = true
    setAppendingRowIds(new Set())
    setVisibleCount(SYM_TABLE_PROGRESSIVE_PAGE_SIZE)
    const scroll = tableScrollRef.current
    if (scroll) scroll.scrollTop = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional filter reset
  }, filterResetDeps)

  useEffect(() => {
    if (!scrollMetrics || viewportFilledRef.current) return
    viewportFilledRef.current = true
    if (userExpandedRef.current) return
    pinScrollTopRef.current = true
    const target = Math.min(catalog.length, scrollMetrics.rowsThatFit)
    setVisibleCount(target)
  }, [scrollMetrics, catalog.length])

  useEffect(() => {
    if (appendingRowIds.size === 0) return
    const timer = window.setTimeout(() => setAppendingRowIds(new Set()), 280)
    return () => window.clearTimeout(timer)
  }, [appendingRowIds])

  useLayoutEffect(() => {
    const scroll = tableScrollRef.current
    const snapshot = appendScrollSnapshotRef.current
    appendScrollSnapshotRef.current = null

    const releaseLoadMore = () => {
      requestAnimationFrame(() => {
        suppressScrollLoadRef.current = false
        loadMoreInFlightRef.current = false
      })
    }

    if (scroll && pinScrollTopRef.current) {
      pinScrollTopRef.current = false
      scroll.scrollTop = 0
      releaseLoadMore()
    } else if (scroll && snapshot) {
      suppressScrollLoadRef.current = true
      restoreSymTableAppendScroll(scroll, snapshot, releaseLoadMore)
    } else {
      releaseLoadMore()
    }
  }, [visibleCount, tableScrollRef])

  const handleLoadMore = useCallback(() => {
    if (loadMoreInFlightRef.current) return
    const count = visibleCountRef.current
    if (count >= catalog.length) return

    const nextCount = Math.min(catalog.length, count + SYM_TABLE_PROGRESSIVE_PAGE_SIZE)
    userExpandedRef.current = true
    loadMoreInFlightRef.current = true
    setAppendingRowIds(new Set(catalog.slice(count, nextCount).map((row) => row.id)))
    const scroll = tableScrollRef.current
    if (scroll) {
      appendScrollSnapshotRef.current = snapshotSymTableAppendScroll(scroll, { animate: true })
    }
    setVisibleCount(nextCount)
  }, [catalog, tableScrollRef])

  const evaluateScrollLoad = useCallback(
    (options: { wheelDownWithoutOverflow?: boolean } = {}) => {
      if (suppressScrollLoadRef.current) return
      if (!hasMoreRows || loadMoreInFlightRef.current) return
      const root = tableScrollRef.current
      if (!root) return

      const canScroll = root.scrollHeight > root.clientHeight + 1
      const distanceFromBottom = root.scrollHeight - root.scrollTop - root.clientHeight

      if (distanceFromBottom > SCROLL_LOAD_REARM_PX) {
        scrollLoadArmedRef.current = true
      }
      if (!scrollLoadArmedRef.current) return

      if (!canScroll) {
        if (!options.wheelDownWithoutOverflow) return
        scrollLoadArmedRef.current = false
        handleLoadMore()
        return
      }

      if (distanceFromBottom > SCROLL_LOAD_THRESHOLD_PX) return

      scrollLoadArmedRef.current = false
      handleLoadMore()
    },
    [hasMoreRows, handleLoadMore, tableScrollRef],
  )

  const tryLoadMoreFromScroll = useCallback(() => {
    evaluateScrollLoad()
  }, [evaluateScrollLoad])

  const handleTableBodyWheel = useCallback(
    (event: { deltaY: number }) => {
      if (event.deltaY < 0) {
        scrollLoadArmedRef.current = true
        return
      }
      if (event.deltaY <= 0) return
      evaluateScrollLoad({ wheelDownWithoutOverflow: true })
    },
    [evaluateScrollLoad],
  )

  return {
    visibleRows,
    visibleCount,
    totalCount: catalog.length,
    hasMoreRows,
    handleLoadMore,
    tryLoadMoreFromScroll,
    handleTableBodyWheel,
    appendingRowIds,
  }
}
