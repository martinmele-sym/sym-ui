import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { ORDER_TYPE_OPTIONS, type OrderType } from '../data/orderTypes'

type SymOrderTypesMultiselectProps = {
  label?: string
  required?: boolean
  value: OrderType[]
  onChange: (next: OrderType[]) => void
  disabled?: boolean
}

export function SymOrderTypesMultiselect({
  label = 'Resource Spec Type',
  required = true,
  value,
  onChange,
  disabled = false,
}: SymOrderTypesMultiselectProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [staging, setStaging] = useState<OrderType[]>(value)

  useEffect(() => {
    if (!open) {
      setStaging(value)
    }
  }, [open, value])

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

  function toggleOption(option: OrderType) {
    setStaging((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    )
  }

  function applySelection() {
    onChange(staging)
    setOpen(false)
  }

  function cancelSelection() {
    setStaging(value)
    setOpen(false)
  }

  function removeChip(option: OrderType, e: ReactMouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onChange(value.filter((item) => item !== option))
  }

  const stagingCount = staging.length
  const itemLabel = stagingCount === 1 ? 'item' : 'items'

  return (
    <div
      ref={rootRef}
      className={`sym-multiselect${open ? ' sym-multiselect--open' : ''}${disabled ? ' sym-multiselect--disabled' : ''}`}
    >
      <label className="sym-multiselect__label">
        {label}
        {required ? (
          <span className="sym-multiselect__required" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>

      <button
        type="button"
        className="sym-multiselect__control"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          setOpen((prev) => !prev)
        }}
      >
        {value.length === 0 ? (
          <span className="sym-multiselect__placeholder">Please select</span>
        ) : (
          <span className="sym-multiselect__chips">
            {value.map((option) => (
              <span key={option} className="sym-multiselect__chip">
                <span className="sym-multiselect__chip-label">{option}</span>
                <button
                  type="button"
                  className="sym-multiselect__chip-remove"
                  aria-label={`Remove ${option}`}
                  onClick={(e) => removeChip(option, e)}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    close
                  </span>
                </button>
              </span>
            ))}
          </span>
        )}
        <span className="material-icons-outlined sym-multiselect__caret" aria-hidden>
          expand_more
        </span>
      </button>

      {open ? (
        <div className="sym-multiselect__panel" id={listboxId} role="listbox" aria-multiselectable="true">
          <div className="sym-multiselect__options">
            {ORDER_TYPE_OPTIONS.map((option) => {
              const checked = staging.includes(option)
              const optionId = `${listboxId}-${option}`
              return (
                <label key={option} htmlFor={optionId} className="sym-multiselect__option">
                  <input
                    id={optionId}
                    type="checkbox"
                    className="form-check-input sym-multiselect__checkbox"
                    checked={checked}
                    onChange={() => toggleOption(option)}
                  />
                  <span className="sym-multiselect__option-label">{option}</span>
                </label>
              )
            })}
          </div>
          <div className="sym-multiselect__footer">
            <button type="button" className="sym-btn-filled-primary sym-btn--sm" onClick={applySelection}>
              Selected ({stagingCount} {itemLabel})
            </button>
            <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={cancelSelection}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
