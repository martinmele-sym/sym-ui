import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type SymImagePreviewModalProps = {
  open: boolean
  src: string
  alt: string
  onClose: () => void
}

/** Lightbox for attached image previews (vendor form, etc.). */
export function SymImagePreviewModal({ open, src, alt, onClose }: SymImagePreviewModalProps) {
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
      className="sym-image-preview-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="sym-image-preview" role="dialog" aria-modal="true" aria-label={alt}>
        <button
          type="button"
          className="sym-image-preview__close"
          aria-label="Close preview"
          onClick={onClose}
        >
          <span className="material-icons-outlined" aria-hidden>
            close
          </span>
        </button>
        <img src={src} alt={alt} className="sym-image-preview__img" />
      </div>
    </div>,
    document.body,
  )
}
