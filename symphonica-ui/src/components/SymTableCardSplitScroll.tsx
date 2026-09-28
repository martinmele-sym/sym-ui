import { useRef, type ReactNode, type RefObject, type UIEvent, type WheelEvent } from 'react'

type SymTableCardSplitScrollProps = {
  scrollRef: RefObject<HTMLDivElement | null>
  headerTable: ReactNode
  bodyTable: ReactNode
  onBodyScroll?: () => void
  onBodyWheel?: (event: WheelEvent<HTMLDivElement>) => void
}

/** Fixed table header outside the scroll region; body scrolls vertically (and syncs horizontal scroll to head). */
export function SymTableCardSplitScroll({
  scrollRef,
  headerTable,
  bodyTable,
  onBodyScroll,
  onBodyWheel,
}: SymTableCardSplitScrollProps) {
  const headScrollRef = useRef<HTMLDivElement>(null)

  const handleBodyScroll = (_event: UIEvent<HTMLDivElement>) => {
    const bodyScroll = scrollRef.current
    const headScroll = headScrollRef.current
    if (bodyScroll && headScroll) {
      headScroll.scrollLeft = bodyScroll.scrollLeft
    }
    onBodyScroll?.()
  }

  return (
    <div className="sym-table-card__table-split">
      <div ref={headScrollRef} className="sym-table-card__table-head">
        {headerTable}
      </div>
      <div
        ref={scrollRef}
        className="sym-table-card__scroll"
        onScroll={handleBodyScroll}
        onWheel={onBodyWheel}
      >
        {bodyTable}
      </div>
    </div>
  )
}
