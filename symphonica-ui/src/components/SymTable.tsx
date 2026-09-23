import { useEffect, useRef, type RefObject, type TableHTMLAttributes } from 'react'

const NON_RESIZABLE_SELECTOR =
  '.sym-table__col--checkbox, .sym-table__col--settings, .sym-table__col--actions, .sym-table__col--no-resize'

const HANDLE_CLASS = 'sym-table__col-resize-handle'
const RESIZABLE_CLASS = 'sym-table__col--resizable'
const RESIZING_BODY_CLASS = 'sym-table-column-resizing'

function getColumnLabel(th: HTMLTableCellElement): string {
  const sortButton = th.querySelector('.sym-table__sort')
  if (sortButton) return sortButton.textContent?.trim() ?? 'column'
  return th.textContent?.trim() ?? 'column'
}

function getMinColumnWidthPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--component-table-column-resize-min-column-width')
    .trim()
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 80
}

function readCssLength(customProperty: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(customProperty).trim()
  return raw || fallback
}

function countActionButtons(actionsRoot: Element): number {
  return actionsRoot.querySelectorAll('.sym-icon-btn').length
}

function measureActionsColumnWidth(table: HTMLTableElement, th: HTMLTableCellElement): string {
  const buttonSize = parseFloat(readCssLength('--component-button-icon-size', '30px'))
  const gap = parseFloat(
    readCssLength('--component-table-actions-column-gap', readCssLength('--core-spacing-8', '8px')),
  )
  const thStyles = getComputedStyle(th)
  const paddingX = parseFloat(thStyles.paddingLeft) + parseFloat(thStyles.paddingRight)

  let maxButtons = 0
  table.querySelectorAll<HTMLElement>('tbody td.sym-table__cell--actions').forEach((cell) => {
    const actions = cell.querySelector('.sym-table-actions')
    if (!actions) return
    maxButtons = Math.max(maxButtons, countActionButtons(actions))
  })

  if (maxButtons === 0) {
    maxButtons = 1
  }

  const toolbarWidth =
    maxButtons * buttonSize + Math.max(0, maxButtons - 1) * gap
  const headerLabel = th.querySelector('.sym-table__sort') ?? th
  const headerWidth = headerLabel.scrollWidth
  const contentWidth = Math.max(toolbarWidth, headerWidth - paddingX)

  return `${Math.ceil(contentWidth + paddingX)}px`
}

function getFixedColumnWidth(table: HTMLTableElement, th: HTMLTableCellElement): string | null {
  if (th.matches('.sym-table__col--settings')) {
    return readCssLength('--component-table-column-settings-width', '40px')
  }
  if (th.matches('.sym-table__col--checkbox')) {
    return readCssLength('--core-size-48', '48px')
  }
  if (th.matches('.sym-table__col--actions')) {
    return measureActionsColumnWidth(table, th)
  }
  return null
}

function lockColumnWidth(cell: HTMLElement, col: HTMLTableColElement | undefined, width: string) {
  cell.style.width = width
  cell.style.minWidth = width
  cell.style.maxWidth = width
  if (col) {
    col.style.width = width
  }
}

function ensureColgroup(table: HTMLTableElement): HTMLTableColElement[] {
  let colgroup = table.querySelector('colgroup')
  const headerCells = table.querySelectorAll<HTMLTableCellElement>('thead tr:first-child > th')
  const count = headerCells.length

  if (!colgroup) {
    colgroup = document.createElement('colgroup')
    table.insertBefore(colgroup, table.firstChild)
  }

  while (colgroup.children.length < count) {
    colgroup.appendChild(document.createElement('col'))
  }
  while (colgroup.children.length > count) {
    colgroup.lastElementChild?.remove()
  }

  return Array.from(colgroup.querySelectorAll('col'))
}

function applyFixedColumnWidths(table: HTMLTableElement) {
  const headerCells = Array.from(
    table.querySelectorAll<HTMLTableCellElement>('thead tr:first-child > th'),
  )
  const cols = ensureColgroup(table)

  headerCells.forEach((th, colIndex) => {
    const fixedWidth = getFixedColumnWidth(table, th)
    if (!fixedWidth) return
    lockColumnWidth(th, cols[colIndex], fixedWidth)
    table.querySelectorAll<HTMLTableCellElement>(`tbody tr > *:nth-child(${colIndex + 1})`).forEach((cell) => {
      lockColumnWidth(cell, undefined, fixedWidth)
    })
  })
}

function attachColumnResize(table: HTMLTableElement): () => void {
  applyFixedColumnWidths(table)

  const headerCells = Array.from(
    table.querySelectorAll<HTMLTableCellElement>('thead tr:first-child > th'),
  )
  const cleanups: (() => void)[] = []

  headerCells.forEach((th, colIndex) => {
    if (th.matches(NON_RESIZABLE_SELECTOR)) return

    th.classList.add(RESIZABLE_CLASS)

    let handle = th.querySelector<HTMLElement>(`.${HANDLE_CLASS}`)
    if (!handle) {
      handle = document.createElement('span')
      handle.className = HANDLE_CLASS
      handle.setAttribute('role', 'separator')
      handle.setAttribute('aria-orientation', 'vertical')
      handle.tabIndex = -1
      th.appendChild(handle)
    }

    handle.setAttribute('aria-label', `Resize ${getColumnLabel(th)} column`)

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      event.stopPropagation()
      handle!.setPointerCapture(event.pointerId)

      const startX = event.clientX
      const startWidth = th.getBoundingClientRect().width
      const minWidth = getMinColumnWidthPx()
      table.style.tableLayout = 'fixed'
      applyFixedColumnWidths(table)
      const cols = ensureColgroup(table)
      document.body.classList.add(RESIZING_BODY_CLASS)

      const onPointerMove = (moveEvent: PointerEvent) => {
        const nextWidth = Math.max(minWidth, Math.round(startWidth + (moveEvent.clientX - startX)))
        const widthValue = `${nextWidth}px`
        th.style.width = widthValue
        th.style.minWidth = widthValue
        th.style.maxWidth = ''
        if (cols[colIndex]) {
          cols[colIndex].style.width = widthValue
        }
        table.querySelectorAll<HTMLTableCellElement>(`tbody tr > *:nth-child(${colIndex + 1})`).forEach((cell) => {
          cell.style.width = widthValue
          cell.style.minWidth = widthValue
          cell.style.maxWidth = ''
        })
        applyFixedColumnWidths(table)
      }

      const endResize = (endEvent: PointerEvent) => {
        if (handle!.hasPointerCapture(endEvent.pointerId)) {
          handle!.releasePointerCapture(endEvent.pointerId)
        }
        handle!.removeEventListener('pointermove', onPointerMove)
        handle!.removeEventListener('pointerup', endResize)
        handle!.removeEventListener('lostpointercapture', endResize)
        document.body.classList.remove(RESIZING_BODY_CLASS)
      }

      handle!.addEventListener('pointermove', onPointerMove)
      handle!.addEventListener('pointerup', endResize)
      handle!.addEventListener('lostpointercapture', endResize)
    }

    handle.addEventListener('pointerdown', onPointerDown)
    cleanups.push(() => {
      handle!.removeEventListener('pointerdown', onPointerDown)
      th.classList.remove(RESIZABLE_CLASS)
      handle!.remove()
    })
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}

/** Wires optional column resize handles on a native `.sym-table` header row. */
export function useSymTableColumnResize(tableRef: RefObject<HTMLTableElement | null>) {
  useEffect(() => {
    const table = tableRef.current
    if (!table) return

    let detach = attachColumnResize(table)
    const headerRow = table.querySelector('thead tr')
    if (!headerRow) {
      return () => detach()
    }

    const observer = new MutationObserver(() => {
      detach()
      detach = attachColumnResize(table)
    })
    observer.observe(headerRow, { childList: true })

    return () => {
      observer.disconnect()
      detach()
      document.body.classList.remove(RESIZING_BODY_CLASS)
    }
  }, [tableRef])
}

/** Primary data table — includes optional column resize on header cell edges. */
export function SymTable({ className, children, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  const ref = useRef<HTMLTableElement>(null)
  useSymTableColumnResize(ref)

  const mergedClassName = ['sym-table', className].filter(Boolean).join(' ')

  return (
    <table ref={ref} className={mergedClassName} {...rest}>
      {children}
    </table>
  )
}
