import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

type SymTableCardSplitScrollProps = {
  scrollRef: RefObject<HTMLDivElement | null>
  headerTable: ReactNode
  bodyTable: ReactNode
}

/** Fixed table header outside the scroll region; body scrolls vertically (and syncs horizontal scroll to head). */
export function SymTableCardSplitScroll({
  scrollRef,
  headerTable,
  bodyTable,
}: SymTableCardSplitScrollProps) {
  const headScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bodyScroll = scrollRef.current
    const headScroll = headScrollRef.current
    if (!bodyScroll || !headScroll) return

    const syncHead = () => {
      headScroll.scrollLeft = bodyScroll.scrollLeft
    }
    syncHead()
    bodyScroll.addEventListener('scroll', syncHead, { passive: true })
    return () => bodyScroll.removeEventListener('scroll', syncHead)
  }, [scrollRef])

  return (
    <div className="sym-table-card__table-split">
      <div ref={headScrollRef} className="sym-table-card__table-head">
        {headerTable}
      </div>
      <div ref={scrollRef} className="sym-table-card__scroll">
        {bodyTable}
      </div>
    </div>
  )
}
