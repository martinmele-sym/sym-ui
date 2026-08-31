import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type SymModalRole = 'info' | 'danger' | 'success'

type SymModalProps = {
  open: boolean
  onClose: () => void
  role?: SymModalRole
  titleId: string
  title: string
  icon?: string | null
  children: ReactNode
  primaryLabel: string
  primaryClassName?: string
  primaryDisabled?: boolean
  onPrimary?: () => void
  cancelLabel?: string
}

/** Modal dialog shell — Guía §5.10 (Figma 7273-4192). Portal to document.body. */
export function SymModal({
  open,
  onClose,
  role = 'info',
  titleId,
  title,
  icon = null,
  children,
  primaryLabel,
  primaryClassName = 'sym-btn-filled-primary',
  primaryDisabled = false,
  onPrimary,
  cancelLabel = 'Cancel',
}: SymModalProps) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="sym-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="sym-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="sym-modal__header">
          <div className={`sym-modal__title-row sym-modal__title-row--${role}`}>
            {icon ? (
              <span className="material-icons-outlined sym-modal__title-icon" aria-hidden>
                {icon}
              </span>
            ) : null}
            <h2 id={titleId} className="sym-modal__title">
              {title}
            </h2>
          </div>
          <button type="button" className="sym-modal__close" onClick={onClose} aria-label="Close dialog">
            <span className="material-icons-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>
        <div className="sym-modal__stack">{children}</div>
        <div className="sym-modal__footer">
          <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${primaryClassName} sym-btn--sm`}
            disabled={primaryDisabled}
            onClick={() => onPrimary?.()}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
