import { useEffect, useId, useRef, useState } from 'react'
import { SymIconTooltipButton } from './SymIconTooltipButton'

export type SymTableColumnOption = {
  id: string
  label: string
  /** Defaults to true when omitted. */
  defaultVisible?: boolean
}

export function buildSymTableColumnVisibility(
  columns: SymTableColumnOption[],
): Record<string, boolean> {
  return Object.fromEntries(
    columns.map((column) => [column.id, column.defaultVisible !== false]),
  )
}

export function useSymTableColumnVisibility(columns: SymTableColumnOption[]) {
  const [visibility, setVisibility] = useState(() => buildSymTableColumnVisibility(columns))

  function toggleColumn(columnId: string) {
    setVisibility((prev) => ({ ...prev, [columnId]: !prev[columnId] }))
  }

  function isColumnVisible(columnId: string) {
    return visibility[columnId] ?? true
  }

  return { visibility, toggleColumn, isColumnVisible }
}

type SymTableColumnSettingsProps = {
  columns: SymTableColumnOption[]
  visibility: Record<string, boolean>
  onToggleColumn: (columnId: string) => void
  tooltip?: string
}

/** Table header settings column — column visibility popover (Figma Resource Inventory). */
export function SymTableColumnSettings({
  columns,
  visibility,
  onToggleColumn,
  tooltip = 'Manage columns',
}: SymTableColumnSettingsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onDocumentPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocumentPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocumentPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`sym-table-column-settings${open ? ' sym-table-column-settings--open' : ''}`}
    >
      <SymIconTooltipButton
        type="button"
        className="sym-table-column-settings__trigger sym-icon-btn sym-icon-btn--primary"
        tooltip={tooltip}
        aria-label={tooltip}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="material-icons-outlined" aria-hidden>
          more_horiz
        </span>
      </SymIconTooltipButton>
      {open ? (
        <div
          id={panelId}
          role="listbox"
          aria-label="Column visibility"
          className="sym-table-column-settings__panel"
        >
          {columns.map((column) => {
            const visible = visibility[column.id] ?? true
            return (
              <button
                key={column.id}
                type="button"
                role="option"
                aria-selected={visible}
                className="sym-table-column-settings__option"
                onClick={() => onToggleColumn(column.id)}
              >
                <span
                  className={`material-icons-outlined sym-table-column-settings__option-icon${
                    visible ? '' : ' sym-table-column-settings__option-icon--hidden'
                  }`}
                  aria-hidden
                >
                  {visible ? 'check' : 'close'}
                </span>
                <span className="sym-table-column-settings__option-label">{column.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
