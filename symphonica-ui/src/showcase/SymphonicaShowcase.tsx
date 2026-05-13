import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'

type SortPhase = 'idle' | 'asc' | 'desc'

const tableRows = [
  {
    id: 'SO-2041',
    status: 'primary' as const,
    badge: 'Live',
    customer: 'Telefonica España',
    updated: '2026-05-08',
  },
  {
    id: 'SO-2042',
    status: 'success' as const,
    badge: 'Ready',
    customer: 'Orange Wholesale',
    updated: '2026-05-07',
  },
  {
    id: 'SO-2043',
    status: 'danger' as const,
    badge: 'Blocked',
    customer: 'Vodafone Group',
    updated: '2026-05-06',
  },
  {
    id: 'SO-2044',
    status: 'info' as const,
    badge: 'Review',
    customer: 'MásMóvil',
    updated: '2026-05-05',
  },
  {
    id: 'SO-2045',
    status: 'process' as const,
    badge: 'Queued',
    customer: 'Colt Technology',
    updated: '2026-05-04',
  },
]

type TableRowData = (typeof tableRows)[number]

const serviceOrdersListRows: TableRowData[] = (() => {
  const variants: TableRowData['status'][] = [
    'primary',
    'success',
    'danger',
    'info',
    'process',
  ]
  const badges = ['Live', 'Ready', 'Blocked', 'Review', 'Queued']
  const customers = [
    'Telefonica España',
    'Orange Wholesale',
    'Vodafone Group',
    'MásMóvil',
    'Colt Technology',
    'BT Global',
    'Telia Company',
    'Deutsche Telekom',
    'Tesco Mobile',
    'KPN',
  ]
  return Array.from({ length: 10 }, (_, i) => ({
    id: `SO-${3001 + i}`,
    status: variants[i % variants.length]!,
    badge: badges[i % badges.length]!,
    customer: customers[i % customers.length]!,
    updated: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
})()

function SortIcon({ phase }: { phase: SortPhase }) {
  const name =
    phase === 'asc' ? 'arrow_upward' : phase === 'desc' ? 'arrow_downward' : 'swap_vert'
  return (
    <span className="material-icons-outlined" aria-hidden>
      {name}
    </span>
  )
}

function Badge({
  variant,
  label,
}: {
  variant: 'primary' | 'success' | 'danger' | 'info' | 'process'
  label: string
}) {
  return (
    <span className={`sym-badge sym-badge--${variant}`} aria-label={label}>
      {label.toUpperCase()}
    </span>
  )
}

function toastReadingDurationMs(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.min(12000, Math.max(4000, 2000 + Math.ceil(words / 14) * 1000))
}

type ShowcaseToast = {
  id: string
  variant: 'success' | 'error' | 'info'
  title: string
  body?: string
  durationMs: number | null
  actions?: { label: string; onClick: () => void }[]
}

function SymToastItem({
  toast,
  onDismiss,
}: {
  toast: ShowcaseToast
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

  return (
    <div
      className={`sym-toast sym-toast--${toast.variant}`}
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

function SymToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ShowcaseToast[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="sym-toast-region">
      {toasts.map((t) => (
        <SymToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

type ShowcaseModalId = 'stable' | 'monitored' | 'export' | 'draft'
type ShowcaseModalRole = 'info' | 'danger' | 'success'

function ShowcaseModal({
  open,
  onClose,
  role,
  titleId,
  title,
  icon,
  children,
  primaryLabel,
  primaryClassName,
  onPrimary,
}: {
  open: boolean
  onClose: () => void
  role: ShowcaseModalRole
  titleId: string
  title: string
  icon: string | null
  children: ReactNode
  primaryLabel: string
  primaryClassName: string
  onPrimary?: () => void
}) {
  if (!open) return null

  return createPortal(
    <div
      className="sym-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
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
          <button
            type="button"
            className="sym-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="material-icons-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>
        <div className="sym-modal__stack">{children}</div>
        <div className="sym-modal__footer">
          <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`${primaryClassName} sym-btn--sm`}
            onClick={() => {
              onPrimary?.()
              onClose()
            }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

type NavView = 'inventory' | 'service-orders'

function OrdersTableCard({
  rows,
  selectedRowId,
  newRowId,
  footerCounter,
  ariaLabel,
}: {
  rows: TableRowData[]
  selectedRowId: string | null
  newRowId: string | null
  footerCounter: string
  ariaLabel: string
}) {
  const [nameSort, setNameSort] = useState<SortPhase>('asc')
  const [dateSort, setDateSort] = useState<SortPhase>('idle')

  const sortedRows = useMemo(() => {
    const copy = [...rows]
    const mult = dateSort === 'desc' ? -1 : 1
    if (dateSort !== 'idle') {
      copy.sort((a, b) => (a.updated < b.updated ? -1 * mult : a.updated > b.updated ? 1 * mult : 0))
    } else if (nameSort === 'asc') {
      copy.sort((a, b) => a.id.localeCompare(b.id))
    } else if (nameSort === 'desc') {
      copy.sort((a, b) => b.id.localeCompare(a.id))
    }
    return copy
  }, [rows, nameSort, dateSort])

  function cycleNameSort() {
    setDateSort('idle')
    setNameSort((p) => (p === 'idle' ? 'asc' : p === 'asc' ? 'desc' : 'idle'))
  }

  function cycleDateSort() {
    setNameSort('idle')
    setDateSort((p) => (p === 'idle' ? 'asc' : p === 'asc' ? 'desc' : 'idle'))
  }

  return (
    <article className="sym-card-primary sym-no-hover">
      <table className="sym-table" aria-label={ariaLabel}>
        <thead>
          <tr>
            <th scope="col">
              <button
                type="button"
                className="sym-table__sort"
                onClick={cycleNameSort}
                aria-label="Sort by service id"
              >
                Service Id
                <SortIcon phase={nameSort} />
              </button>
            </th>
            <th scope="col">Status</th>
            <th scope="col">Customer</th>
            <th scope="col">
              <button
                type="button"
                className="sym-table__sort"
                onClick={cycleDateSort}
                aria-label="Sort by last sync"
              >
                Last sync
                <SortIcon phase={dateSort} />
              </button>
            </th>
            <th scope="col" style={{ width: 'var(--core-size-56)' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const rowClass =
              row.id === selectedRowId
                ? 'sym-table__row--selected'
                : row.id === newRowId
                  ? 'sym-table__row--new'
                  : ''
            return (
              <tr key={row.id} className={rowClass}>
                <td>{row.id}</td>
                <td>
                  <Badge variant={row.status} label={row.badge} />
                </td>
                <td>{row.customer}</td>
                <td>{row.updated}</td>
                <td className="sym-table__cell--actions">
                  <div className="sym-table-actions">
                    <SymIconTooltipButton
                      className="sym-icon-btn sym-icon-btn--primary"
                      aria-label={`View ${row.id}`}
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        visibility
                      </span>
                    </SymIconTooltipButton>
                    <SymIconTooltipButton
                      className="sym-icon-btn sym-icon-btn--primary"
                      aria-label={`Open ${row.id} in new window`}
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        open_in_new
                      </span>
                    </SymIconTooltipButton>
                    <SymIconTooltipButton
                      className="sym-icon-btn sym-icon-btn--danger"
                      aria-label={`Delete ${row.id}`}
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        delete
                      </span>
                    </SymIconTooltipButton>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <footer className="sym-table-footer">
        <span />
        <div className="sym-table-footer__center">
          <SymIconTooltipButton
            className="sym-icon-btn sym-icon-btn--primary sym-table-footer__load-more"
            aria-label="Load more items"
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
          </SymIconTooltipButton>
        </div>
        <div className="sym-table-footer__counter">{footerCounter}</div>
      </footer>
    </article>
  )
}

export function SymphonicaShowcase({ mode }: { mode: 'home' | 'serviceOrders' }) {
  const navigate = useNavigate()
  const workflowOrdersPillIndex = 3
  const [pillSectionA, setPillSectionA] = useState(() =>
    mode === 'serviceOrders' ? workflowOrdersPillIndex : 0,
  )
  const [tab, setTab] = useState(0)
  const [gridPill, setGridPill] = useState(0)
  const [lifecycleSegment, setLifecycleSegment] = useState(0)
  const [showcaseModal, setShowcaseModal] = useState<ShowcaseModalId | null>(null)
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv')
  const [toasts, setToasts] = useState<ShowcaseToast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback((partial: Omit<ShowcaseToast, 'id'> & { id?: string }) => {
    const id = partial.id ?? crypto.randomUUID()
    setToasts((prev) => [...prev, { ...partial, id }])
    return id
  }, [])

  const navView: NavView = mode === 'serviceOrders' ? 'service-orders' : 'inventory'

  const lifecycleSegments = [
    { label: 'Blueprint', count: 24 },
    { label: 'Runtime', count: 101 },
    { label: 'Exceptions', count: 7 },
  ] as const

  useEffect(() => {
    if (!showcaseModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowcaseModal(null)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showcaseModal])

  function handleHeaderPillClick(index: number) {
    if (index === workflowOrdersPillIndex) {
      navigate('/service-orders')
      setPillSectionA(workflowOrdersPillIndex)
      return
    }
    navigate('/')
    setPillSectionA(index)
  }

  return (
    <div className="sym-page">
      {/* 1. Primary Card — Card Header */}
      <article className="sym-card-primary sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">
              {mode === 'home' ? 'Symphonica showcase' : 'Service orders'}
            </h1>
            <p className="sym-card-meta">Source: BSS</p>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <button
                type="button"
                className="sym-btn-outlined-icon-only"
                aria-label="Refresh"
              >
                <span className="material-icons-outlined" aria-hidden>
                  refresh
                </span>
              </button>
              <button
                type="button"
                className="sym-btn-outlined-icon-only"
                aria-label="Download"
              >
                <span className="material-icons-outlined" aria-hidden>
                  file_download
                </span>
              </button>
              <div
                className="d-flex flex-wrap align-items-center"
                style={{ gap: 'var(--core-spacing-8)' }}
                role="tablist"
                aria-label="Section navigation"
              >
                {['Inventory', 'Service Orders', 'Service Tests', 'Workflow Orders'].map(
                  (label, i) => (
                    <button
                      key={label}
                      type="button"
                      role="tab"
                      aria-selected={pillSectionA === i}
                      className={`sym-pill${pillSectionA === i ? ' sym-pill--active' : ''}`}
                      onClick={() => handleHeaderPillClick(i)}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="sym-card-header__right">
              <button type="button" className="sym-btn-filled-primary">
                <span className="material-icons-outlined" aria-hidden>
                  add
                </span>
                Create service order
              </button>
            </div>
          </div>
        </header>
      </article>

      {navView === 'inventory' && (
        <>
          <OrdersTableCard
            rows={tableRows}
            selectedRowId="SO-2042"
            newRowId="SO-2043"
            footerCounter="Showing 10 of 152 items"
            ariaLabel="Service orders (showcase sample)"
          />

          {/* 3. Large Secondary Cards */}
      <div className="row sym-row">
        <div className="col-md-4 d-flex">
          <article className="sym-card-secondary flex-grow-1 sym-no-hover">
            <h2 className="sym-card-title">Lifecycle overview</h2>
            <div className="sym-subtitle-label">Provisioning scope</div>
            <div className="sym-btn-group" role="radiogroup" aria-label="Lifecycle segments">
              {lifecycleSegments.map((seg, i) => (
                <button
                  key={seg.label}
                  type="button"
                  role="radio"
                  aria-checked={lifecycleSegment === i}
                  className={`sym-btn-group__segment${lifecycleSegment === i ? ' sym-btn-group__segment--selected' : ''}`}
                  onClick={() => setLifecycleSegment(i)}
                >
                  <span className="sym-btn-group__label">{seg.label}</span>
                  <span className="sym-btn-group__count" aria-label={`${seg.count} items`}>
                    {seg.count}
                  </span>
                </button>
              ))}
            </div>
            <p className="sym-card-body-text">
              Secondary card body uses standard spacing. Segmented Button Group (counts use{' '}
              <code>component.buttonGroup.countBadge</code>, not header pills).
            </p>
            <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: 'var(--core-spacing-8)' }}
            >
              <button
                type="button"
                className="sym-btn-filled-success"
                onClick={() => setShowcaseModal('stable')}
              >
                Stable
              </button>
              <button
                type="button"
                className="sym-btn-filled-danger"
                onClick={() => setShowcaseModal('monitored')}
              >
                Monitored
              </button>
              <button
                type="button"
                className="sym-btn-filled-primary"
                onClick={() => setShowcaseModal('export')}
              >
                Export CSV
              </button>
              <button
                type="button"
                className="sym-btn-filled-primary"
                onClick={() => setShowcaseModal('draft')}
              >
                <span className="material-icons-outlined" aria-hidden>
                  save
                </span>
                Save draft
              </button>
            </div>
          </article>
        </div>
        <div className="col-md-4 d-flex">
          <article className="sym-card-secondary sym-card-secondary--state-hover flex-grow-1 sym-no-hover">
            <h2 className="sym-card-title">Operations bridge</h2>
            <div className="sym-subtitle-label sym-subtitle-label--success sym-subtitle-label--with-switch">
              <span>Notifications</span>
              <div className="form-check form-switch sym-subtitle-label__switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showcase-switch"
                  defaultChecked
                  aria-label="Enable notifications"
                />
              </div>
            </div>
            <ul className="nav nav-tabs sym-nav-tabs-top" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${tab === 0 ? ' active' : ''}`}
                  aria-selected={tab === 0}
                  id="tab-a"
                  onClick={() => setTab(0)}
                >
                  Incidents
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${tab === 1 ? ' active' : ''}`}
                  aria-selected={tab === 1}
                  id="tab-b"
                  onClick={() => setTab(1)}
                >
                  Changes
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${tab === 2 ? ' active' : ''}`}
                  aria-selected={tab === 2}
                  id="tab-c"
                  onClick={() => setTab(2)}
                >
                  Policies
                </button>
              </li>
            </ul>
            <div
              className="tab-content"
              role="tabpanel"
              id="showcase-tabs-panel"
              aria-labelledby={tab === 0 ? 'tab-a' : tab === 1 ? 'tab-b' : 'tab-c'}
              style={{ paddingTop: 'var(--core-spacing-12)' }}
            >
              {tab === 0 && (
                <p className="sym-card-body-text">
                  Tabs Top tokens style Bootstrap `nav-tabs` inside secondary cards (§5.7).
                </p>
              )}
              {tab === 1 && (
                <p className="sym-card-body-text">
                  Change records remain linked to the service inventory identifiers.
                </p>
              )}
              {tab === 2 && (
                <p className="sym-card-body-text">
                  Policy bundles inherit from the domain catalog.
                </p>
              )}
            </div>
            <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: 'var(--core-spacing-8)' }}
            >
              <button type="button" className="sym-btn-outlined-labeled-danger">
                Action
              </button>
              <button type="button" className="sym-btn-outlined-labeled-success">
                Approve
              </button>
              <button type="button" className="sym-btn-outlined-labeled">
                Discard
              </button>
            </div>
          </article>
        </div>
        <div className="col-md-4 d-flex">
          <article className="sym-card-secondary flex-grow-1 sym-no-hover">
            <h2 className="sym-card-title">Enrollment</h2>
            <div className="sym-subtitle-label sym-subtitle-label--error">Customer profile</div>
            <form
              className="d-flex flex-column"
              style={{ gap: 'var(--core-spacing-12)' }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="sym-form-label form-label" htmlFor="showcase-email">
                  Email
                </label>
                <input
                  id="showcase-email"
                  type="email"
                  className="form-control sym-form-control"
                  placeholder="name@telefonica.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="sym-form-label form-label" htmlFor="showcase-region">
                  Region
                </label>
                <select
                  id="showcase-region"
                  className="form-select sym-form-control"
                  defaultValue="eu"
                >
                  <option value="eu">EU</option>
                  <option value="latam">LATAM</option>
                </select>
              </div>
              <div className="d-flex flex-wrap" style={{ gap: 'var(--core-spacing-8)' }}>
                <button type="submit" className="sym-btn-filled-primary">
                  Submit
                </button>
                <button type="button" className="sym-btn-outlined-labeled">
                  Reset
                </button>
              </div>
            </form>
          </article>
        </div>
      </div>

      {/* 4. Small Secondary Grid */}
      <div className="row sym-row">
        <div className="col-md-3 d-flex">
          <article className="sym-card-secondary sym-card-secondary--grid flex-grow-1 sym-no-hover d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h2 className="sym-card-title sym-card-title--grid">API North</h2>
              <Badge variant="primary" label="live" />
            </div>
            <p className="sym-card-meta">Latency p95 · 120ms</p>
            <div
              className="d-flex flex-wrap align-items-center"
              style={{ gap: 'var(--core-spacing-8)' }}
              role="radiogroup"
              aria-label="API modes"
            >
              {['Sync', 'Async'].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  className={`sym-pill${gridPill === i ? ' sym-pill--active' : ''}`}
                  aria-checked={gridPill === i}
                  onClick={() => setGridPill(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="sym-table-actions sym-stack-bottom">
              <SymIconTooltipButton
                className="sym-icon-btn sym-icon-btn--primary-card"
                aria-label="Edit API North"
              >
                <span className="material-icons-outlined" aria-hidden>
                  edit
                </span>
              </SymIconTooltipButton>
              <SymIconTooltipButton
                className="sym-icon-btn sym-icon-btn--primary-card"
                aria-label="More"
              >
                <span className="material-icons-outlined" aria-hidden>
                  more_vert
                </span>
              </SymIconTooltipButton>
            </div>
          </article>
        </div>
        <div className="col-md-3 d-flex">
          <article className="sym-card-secondary sym-card-secondary--grid sym-card-secondary--state-hover flex-grow-1 sym-no-hover d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h2 className="sym-card-title sym-card-title--grid">API West</h2>
              <Badge variant="success" label="healthy" />
            </div>
            <p className="sym-card-meta">Ingress · REST</p>
            <p className="sym-card-body-text">Pinned hover shadow for grid review.</p>
            <div className="sym-table-actions sym-stack-bottom">
              <SymIconTooltipButton
                className="sym-icon-btn sym-icon-btn--primary-card"
                aria-label="Copy endpoint"
              >
                <span className="material-icons-outlined" aria-hidden>
                  content_copy
                </span>
              </SymIconTooltipButton>
            </div>
          </article>
        </div>
        <div className="col-md-3 d-flex">
          <article className="sym-card-secondary sym-card-secondary--grid sym-card-secondary--state-active flex-grow-1 sym-no-hover d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h2 className="sym-card-title sym-card-title--grid">API South</h2>
              <Badge variant="danger" label="risk" />
            </div>
            <p className="sym-card-meta">Queue depth · high</p>
            <p className="sym-card-body-text">Active border uses semantic success token.</p>
            <div className="sym-table-actions sym-stack-bottom">
              <SymIconTooltipButton
                className="sym-icon-btn sym-icon-btn--danger-card"
                aria-label="Delete connector"
              >
                <span className="material-icons-outlined" aria-hidden>
                  delete
                </span>
              </SymIconTooltipButton>
            </div>
          </article>
        </div>
        <div className="col-md-3 d-flex">
          <article className="sym-card-secondary sym-card-secondary--grid sym-card-secondary--state-selected flex-grow-1 sym-no-hover d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h2 className="sym-card-title sym-card-title--grid">API East</h2>
              <Badge variant="process" label="beta" />
            </div>
            <p className="sym-card-meta">Traffic share · 18%</p>
            <p className="sym-card-body-text">Selected border highlights procurement focus.</p>
            <div className="sym-table-actions sym-stack-bottom">
              <SymIconTooltipButton
                className="sym-icon-btn sym-icon-btn--primary-card"
                aria-label="Open documentation"
              >
                <span className="material-icons-outlined" aria-hidden>
                  open_in_new
                </span>
              </SymIconTooltipButton>
            </div>
          </article>
        </div>
      </div>
        </>
      )}

      {navView === 'service-orders' && (
        <OrdersTableCard
          rows={serviceOrdersListRows}
          selectedRowId="SO-3010"
          newRowId="SO-3006"
          footerCounter="Showing 10 of 248 items"
          ariaLabel="Service orders (full list)"
        />
      )}

      <ShowcaseModal
        open={showcaseModal === 'stable'}
        onClose={() => setShowcaseModal(null)}
        role="success"
        titleId="showcase-modal-stable-title"
        title="Mark lifecycle view stable?"
        icon="verified"
        primaryLabel="Yes, mark stable"
        primaryClassName="sym-btn-filled-success"
        onPrimary={() => {
          pushToast({
            variant: 'success',
            title: 'Operation Successfully',
            body: 'Lifecycle view marked stable.',
            durationMs: 4000,
          })
        }}
      >
        <div className="sym-modal__featured">Blueprint segment · Lifecycle overview</div>
        <p className="sym-modal__support">
          Stable views notify downstream automation jobs and freeze churn dashboards until you
          release again.
        </p>
      </ShowcaseModal>

      <ShowcaseModal
        open={showcaseModal === 'monitored'}
        onClose={() => setShowcaseModal(null)}
        role="danger"
        titleId="showcase-modal-monitored-title"
        title="Pause monitoring for connector?"
        icon="visibility_off"
        primaryLabel="Yes, pause monitoring"
        primaryClassName="sym-btn-filled-danger"
        onPrimary={() => {
          const id = crypto.randomUUID()
          pushToast({
            id,
            variant: 'error',
            title: 'Operation Failed',
            body: 'Monitoring pause did not complete for API North. Check bridge connectivity, then retry or dismiss.',
            durationMs: null,
            actions: [
              {
                label: 'Retry',
                onClick: () => {
                  dismissToast(id)
                  pushToast({
                    variant: 'info',
                    title: 'Operation Info',
                    body: 'Retry queued — this sample toast autohides in four seconds.',
                    durationMs: 4000,
                  })
                },
              },
              {
                label: 'Dismiss',
                onClick: () => dismissToast(id),
              },
            ],
          })
        }}
      >
        <div className="sym-modal__featured">Connector · API North</div>
        <p className="sym-modal__support">
          Telemetry alerts stop immediately for this target. You can resume monitoring from the
          bridge panel afterwards.
        </p>
      </ShowcaseModal>

      <ShowcaseModal
        open={showcaseModal === 'export'}
        onClose={() => setShowcaseModal(null)}
        role="info"
        titleId="showcase-modal-export-title"
        title="Export filtered orders"
        icon="download"
        primaryLabel="Export"
        primaryClassName="sym-btn-filled-primary"
        onPrimary={() => {
          const id = crypto.randomUUID()
          pushToast({
            id,
            variant: 'success',
            title: 'Operation Successfully',
            body: 'Your export is being prepared. Large extracts may take up to two minutes. You can leave this page—we will notify you when the file is ready.',
            durationMs: 8000,
            actions: [
              { label: 'View exports', onClick: () => dismissToast(id) },
              { label: 'Close', onClick: () => dismissToast(id) },
            ],
          })
        }}
      >
        <p className="sym-modal__support">
          Rows reflect the current table filters and column visibility in this showcase sample.
        </p>
        <div>
          <label className="sym-form-label form-label" htmlFor="showcase-export-format">
            File format
          </label>
          <select
            id="showcase-export-format"
            className="form-select sym-form-control"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value === 'xlsx' ? 'xlsx' : 'csv')}
          >
            <option value="csv">CSV (UTF-8, comma-separated)</option>
            <option value="xlsx">Excel workbook (.xlsx)</option>
          </select>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="showcase-export-headers"
            defaultChecked
          />
          <label className="form-check-label" htmlFor="showcase-export-headers">
            Include header row
          </label>
        </div>
        <div>
          <label className="sym-form-label form-label" htmlFor="showcase-export-note">
            Notes{' '}
            <span style={{ color: 'var(--semantic-text-secondary)', fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <textarea
            id="showcase-export-note"
            className="form-control sym-form-control"
            rows={3}
            placeholder="Add an export memo for audit trails…"
          />
        </div>
      </ShowcaseModal>

      <ShowcaseModal
        open={showcaseModal === 'draft'}
        onClose={() => setShowcaseModal(null)}
        role="info"
        titleId="showcase-modal-draft-title"
        title="Save draft?"
        icon="save"
        primaryLabel="Save draft"
        primaryClassName="sym-btn-filled-primary"
        onPrimary={() => {
          const body =
            'Draft saved locally for this session. Inventory cards and segmented counts will reload when you return to this section.'
          pushToast({
            variant: 'info',
            title: 'Operation Info',
            body,
            durationMs: toastReadingDurationMs(body),
          })
        }}
      >
        <div className="sym-modal__featured">Card draft · Lifecycle overview</div>
        <p className="sym-modal__support">
          Saves banner chips and segmented counts locally for this session. Replace with API-backed
          persistence in production.
        </p>
      </ShowcaseModal>

      <SymToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
