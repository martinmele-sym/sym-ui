import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type SymToastVariant = 'success' | 'error' | 'info'

export type SymToast = {
  id: string
  variant: SymToastVariant
  title: string
  body?: string
  durationMs: number | null
  actions?: { label: string; onClick: () => void }[]
}

export function toastReadingDurationMs(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.min(12000, Math.max(4000, 2000 + Math.ceil(words / 14) * 1000))
}

function SymToastItem({
  toast,
  onDismiss,
}: {
  toast: SymToast
  onDismiss: (id: string) => void
}) {
  const pausedRef = useRef(false)

  useEffect(() => {
    if (toast.durationMs === null) return
    let remaining = toast.durationMs
    const step = 100
    const intervalId = window.setInterval(() => {
      if (pausedRef.current) return
      remaining -= step
      if (remaining <= 0) {
        window.clearInterval(intervalId)
        onDismiss(toast.id)
      }
    }, step)
    return () => window.clearInterval(intervalId)
  }, [toast.id, toast.durationMs, onDismiss])

  const isExpanded = Boolean(toast.body?.trim()) || Boolean(toast.actions?.length)

  return (
    <div
      className={`sym-toast sym-toast--${toast.variant}${isExpanded ? ' sym-toast--expanded' : ''}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <div className="sym-toast__header">
        <p className="sym-toast__title">{toast.title}</p>
        <button
          type="button"
          className="sym-toast__close"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
        >
          <span className="material-icons-outlined" aria-hidden>
            close
          </span>
        </button>
      </div>
      {toast.body ? <p className="sym-toast__body">{toast.body}</p> : null}
      {toast.actions && toast.actions.length > 0 ? (
        <div className="sym-toast__actions">
          {toast.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="sym-toast__action"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SymToastStack({
  toasts,
  onDismiss,
}: {
  toasts: SymToast[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="sym-toast-region">
      {toasts.map((toast) => (
        <SymToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

export function useSymToasts() {
  const [toasts, setToasts] = useState<SymToast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((partial: Omit<SymToast, 'id'> & { id?: string }) => {
    const id = partial.id ?? `toast-${Date.now()}`
    setToasts((prev) => [...prev, { ...partial, id }])
    return id
  }, [])

  return { toasts, pushToast, dismissToast }
}
