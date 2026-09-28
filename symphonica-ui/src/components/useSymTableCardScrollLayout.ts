import { useLayoutEffect, useRef, type RefObject } from 'react'

const TABLE_HEADER_HEIGHT_PX = 40
const TABLE_ROW_HEIGHT_PX = 40

export type SymTableScrollMetrics = {
  scrollMaxHeight: number
  rowsThatFit: number
}

type Options = {
  fillViewport?: boolean
  onMetrics?: (metrics: SymTableScrollMetrics) => void
}

function readPx(value: string, fallback = 0): number {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function estimateTableRowsThatFit(scrollMaxHeight: number): number {
  const body = Math.max(0, scrollMaxHeight - TABLE_HEADER_HEIGHT_PX)
  return Math.max(1, Math.floor(body / TABLE_ROW_HEIGHT_PX))
}

export function useSymTableCardScrollLayout(
  panelRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
  options: Options = {},
) {
  const { fillViewport = true, onMetrics } = options
  const onMetricsRef = useRef(onMetrics)
  onMetricsRef.current = onMetrics

  useLayoutEffect(() => {
    const panel = panelRef.current
    const scroll = scrollRef.current
    if (!panel || !scroll) return

    const update = () => {
      const page = panel.closest('.sym-page--table-dashboard')
      const appBody = panel.closest('.sym-app-body')
      if (!page) return

      const pageStyle = getComputedStyle(page)
      const copyrightGap = readPx(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--layout-body-page-copyright-gap',
        ),
        16,
      )
      const copyrightLine = readPx(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--layout-body-page-copyright-font-size',
        ),
        12,
      ) * 1.5
      const pagePaddingBottom = readPx(pageStyle.paddingBottom, 0)

      const bottomLimit = appBody
        ? appBody.getBoundingClientRect().bottom
        : window.innerHeight
      const panelTop = panel.getBoundingClientRect().top
      const panelMaxHeight = Math.max(
        120,
        bottomLimit - panelTop - pagePaddingBottom - copyrightGap - copyrightLine,
      )

      const panelComputed = getComputedStyle(panel)
      const panelPaddingY =
        readPx(panelComputed.paddingTop) + readPx(panelComputed.paddingBottom)

      const footerEl = panel.querySelector('.sym-table-footer')
      const footerHeight = footerEl?.getBoundingClientRect().height ?? 0

      let toolbarHeight = 0
      for (const child of Array.from(panel.children)) {
        if (
          child instanceof HTMLElement &&
          !child.classList.contains('sym-table-card__scroll') &&
          !child.classList.contains('sym-table-footer') &&
          !child.classList.contains('sym-table-card__table-split')
        ) {
          toolbarHeight += child.getBoundingClientRect().height
        }
      }

      const split = panel.querySelector('.sym-table-card__table-split')
      const headTable = split?.querySelector('.sym-table-card__table-head .sym-table')
      const bodyTable = scroll.querySelector('.sym-table')
      const legacyTable = split ? null : bodyTable

      const headerHeight = headTable?.getBoundingClientRect().height ?? 0
      const bodyContentHeight = bodyTable?.getBoundingClientRect().height ?? 0
      const contentHeight = split
        ? headerHeight + bodyContentHeight
        : legacyTable?.getBoundingClientRect().height ?? 0

      const scrollMaxHeight = Math.max(
        80,
        panelMaxHeight - footerHeight - panelPaddingY - toolbarHeight,
      )

      const contentPanelHeight = contentHeight + footerHeight + panelPaddingY + toolbarHeight
      const panelHeight = fillViewport
        ? panelMaxHeight
        : Math.min(panelMaxHeight, contentPanelHeight)

      panel.classList.toggle('sym-card-primary--table-panel--fill', fillViewport)
      panel.style.height = `${panelHeight}px`
      panel.style.maxHeight = `${panelMaxHeight}px`

      if (split && headTable) {
        const scrollMaxForBody = Math.max(80, scrollMaxHeight - headerHeight)
        const bodyOverflows = bodyContentHeight > scrollMaxForBody
        const useFixedBodyViewport = fillViewport || bodyOverflows
        scroll.style.maxHeight = `${scrollMaxForBody}px`
        scroll.style.height = `${useFixedBodyViewport ? scrollMaxForBody : bodyContentHeight}px`
        scroll.style.flex = useFixedBodyViewport ? '1 1 auto' : '0 0 auto'
      } else {
        const scrollHeight = Math.min(contentHeight, scrollMaxHeight)
        scroll.style.maxHeight = `${scrollMaxHeight}px`
        scroll.style.height = `${scrollHeight}px`
        scroll.style.flex = '0 0 auto'
      }

      onMetricsRef.current?.({
        scrollMaxHeight,
        rowsThatFit: estimateTableRowsThatFit(scrollMaxHeight),
      })
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(panel)
    resizeObserver.observe(scroll)
    const bodyTableEl = scroll.querySelector('.sym-table')
    if (bodyTableEl) {
      resizeObserver.observe(bodyTableEl)
    }
    const splitHeadTable = panel.querySelector('.sym-table-card__table-head .sym-table')
    if (splitHeadTable) {
      resizeObserver.observe(splitHeadTable)
    }
    window.addEventListener('resize', update)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', update)
      panel.classList.remove('sym-card-primary--table-panel--fill')
      panel.style.height = ''
      panel.style.maxHeight = ''
      scroll.style.maxHeight = ''
      scroll.style.height = ''
      scroll.style.flex = ''
    }
  }, [panelRef, scrollRef, fillViewport, ...deps])
}
