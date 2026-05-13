import { useState } from 'react'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'

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

/** Party Domain showcase — canonical Filters Primary Card header per §5.5 "Filters variant — implementation contract (assistants / Cursor)" in Symphonica_design.md (Figma 7872:9277). */
export function PartyDomainShowcase() {
  const [partyTab, setPartyTab] = useState(0)
  const [gridPill, setGridPill] = useState(0)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)

  return (
    <div className="sym-page">
      <article className="sym-card-primary sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">Party domain</h1>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <div className="sym-card-header__filters" aria-label="Party filters">
                <button type="button" className="sym-btn-outlined-icon-only" aria-label="Refresh">
                  <span className="material-icons-outlined" aria-hidden>
                    refresh
                  </span>
                </button>
                <button type="button" className="sym-btn-outlined-icon-only" aria-label="Download">
                  <span className="material-icons-outlined" aria-hidden>
                    file_download
                  </span>
                </button>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="party-filter-name">
                    Party name
                  </label>
                  <input
                    id="party-filter-name"
                    type="search"
                    className="form-control sym-form-control"
                    placeholder="Party name"
                    autoComplete="off"
                  />
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="party-filter-type">
                    Party type
                  </label>
                  <select
                    id="party-filter-type"
                    className="form-select sym-form-control"
                    defaultValue=""
                  >
                    <option value="">All types</option>
                    <option value="org">Organization</option>
                    <option value="person">Person</option>
                  </select>
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="party-filter-status">
                    Status
                  </label>
                  <select
                    id="party-filter-status"
                    className="form-select sym-form-control"
                    defaultValue=""
                  >
                    <option value="">Any status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only"
                  aria-label="Clear filters"
                >
                  <span className="material-icons-outlined" aria-hidden>
                    filter_alt_off
                  </span>
                </button>
                <button
                  type="button"
                  className={
                    advancedFiltersOpen
                      ? 'sym-btn-filled-primary sym-btn-filled-primary--icon-only'
                      : 'sym-btn-outlined-icon-only'
                  }
                  aria-label="Advanced filters"
                  aria-pressed={advancedFiltersOpen}
                  aria-expanded={advancedFiltersOpen}
                  aria-controls="party-header-advanced-filters"
                  onClick={() => setAdvancedFiltersOpen((v) => !v)}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    tune
                  </span>
                </button>
              </div>
            </div>
            <div className="sym-card-header__right">
              <button type="button" className="sym-btn-filled-primary">
                <span className="material-icons-outlined" aria-hidden>
                  add
                </span>
                Create party
              </button>
            </div>
          </div>
          {advancedFiltersOpen ? (
            <div
              id="party-header-advanced-filters"
              className="sym-card-header__advanced-row sym-card-header__filters"
              role="region"
              aria-label="Advanced party filters"
            >
              <div className="sym-card-header__filter-field sym-card-header__filter-field--advanced-toolbar">
                <label className="visually-hidden" htmlFor="party-filter-created-after">
                  Created after
                </label>
                <input
                  id="party-filter-created-after"
                  type="date"
                  className="form-control sym-form-control"
                />
              </div>
              <div className="sym-card-header__filter-field sym-card-header__filter-field--advanced-toolbar">
                <label className="visually-hidden" htmlFor="party-filter-segment">
                  Customer segment
                </label>
                <select id="party-filter-segment" className="form-select sym-form-control" defaultValue="">
                  <option value="">Segment</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="smb">SMB</option>
                  <option value="public">Public sector</option>
                </select>
              </div>
              <div className="sym-card-header__filter-field sym-card-header__filter-field--advanced-toolbar">
                <label className="visually-hidden" htmlFor="party-filter-region">
                  Billing region
                </label>
                <select id="party-filter-region" className="form-select sym-form-control" defaultValue="">
                  <option value="">Billing region</option>
                  <option value="eu">EU</option>
                  <option value="latam">LATAM</option>
                </select>
              </div>
            </div>
          ) : null}
        </header>
      </article>

      <div className="row sym-row">
        <div className="col-md-6 d-flex">
          <article className="sym-card-secondary sym-card-secondary--state-hover flex-grow-1 sym-no-hover">
            <h2 className="sym-card-title">Party workspace</h2>
            <div className="sym-subtitle-label sym-subtitle-label--info sym-subtitle-label--with-switch">
              <span>Registration scope</span>
              <div className="form-check form-switch sym-subtitle-label__switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="party-domain-draft-switch"
                  defaultChecked
                  aria-label="Include draft parties"
                />
              </div>
            </div>
            <ul className="nav nav-tabs sym-nav-tabs-top" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${partyTab === 0 ? ' active' : ''}`}
                  aria-selected={partyTab === 0}
                  id="party-tab-details"
                  onClick={() => setPartyTab(0)}
                >
                  Details
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${partyTab === 1 ? ' active' : ''}`}
                  aria-selected={partyTab === 1}
                  id="party-tab-contacts"
                  onClick={() => setPartyTab(1)}
                >
                  Contacts
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${partyTab === 2 ? ' active' : ''}`}
                  aria-selected={partyTab === 2}
                  id="party-tab-policies"
                  onClick={() => setPartyTab(2)}
                >
                  Policies
                </button>
              </li>
            </ul>
            <div
              className="tab-content"
              role="tabpanel"
              aria-labelledby={
                partyTab === 0 ? 'party-tab-details' : partyTab === 1 ? 'party-tab-contacts' : 'party-tab-policies'
              }
              style={{ paddingTop: 'var(--core-spacing-12)' }}
            >
              {partyTab === 0 && (
                <form
                  className="d-flex flex-column"
                  style={{ gap: 'var(--core-spacing-16)' }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="sym-form-label form-label" htmlFor="party-legal-name">
                      Legal name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="party-legal-name"
                      type="text"
                      className="form-control sym-form-control"
                      placeholder="Registered legal entity"
                      autoComplete="organization"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="sym-form-label form-label" htmlFor="party-tax-id">
                        Tax identifier
                      </label>
                      <input
                        id="party-tax-id"
                        type="text"
                        className="form-control sym-form-control"
                        placeholder="ES-B12345678"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="sym-form-label form-label" htmlFor="party-country">
                        Country
                      </label>
                      <select id="party-country" className="form-select sym-form-control" defaultValue="es">
                        <option value="es">Spain</option>
                        <option value="de">Germany</option>
                        <option value="gb">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="sym-form-label form-label" htmlFor="party-notes">
                      Notes
                    </label>
                    <textarea
                      id="party-notes"
                      className="form-control sym-form-control"
                      rows={3}
                      placeholder="Internal notes (optional)"
                    />
                  </div>
                  <div className="d-flex flex-wrap" style={{ gap: 'var(--core-spacing-8)' }}>
                    <button type="submit" className="sym-btn-filled-primary">
                      Save draft
                    </button>
                    <button type="button" className="sym-btn-outlined-labeled">
                      Reset
                    </button>
                  </div>
                </form>
              )}
              {partyTab === 1 && (
                <div className="d-flex flex-column" style={{ gap: 'var(--core-spacing-12)' }}>
                  <p className="sym-card-body-text mb-0">
                    Primary and billing contacts for this party. Bootstrap fields use{' '}
                    <code>sym-form-control</code> per §5.10 / showcase patterns.
                  </p>
                  <div>
                    <label className="sym-form-label form-label" htmlFor="party-contact-email">
                      Billing email
                    </label>
                    <input
                      id="party-contact-email"
                      type="email"
                      className="form-control sym-form-control"
                      placeholder="billing@example.com"
                    />
                  </div>
                  <div>
                    <label className="sym-form-label form-label" htmlFor="party-contact-phone">
                      Phone
                    </label>
                    <input
                      id="party-contact-phone"
                      type="tel"
                      className="form-control sym-form-control"
                      placeholder="+34 900 000 000"
                    />
                  </div>
                </div>
              )}
              {partyTab === 2 && (
                <div className="d-flex flex-column" style={{ gap: 'var(--core-spacing-12)' }}>
                  <p className="sym-card-body-text mb-0">
                    Policy bundles attached to the party catalog. Use badges for lightweight status
                    chips (§5.2).
                  </p>
                  <div className="d-flex flex-wrap align-items-center" style={{ gap: 'var(--core-spacing-8)' }}>
                    <Badge variant="success" label="kyc ok" />
                    <Badge variant="info" label="review" />
                    <Badge variant="process" label="pending" />
                  </div>
                  <ul className="sym-card-body-text mb-0 ps-3">
                    <li>Data retention — EU standard template</li>
                    <li>Marketing consent — explicit opt-in</li>
                  </ul>
                </div>
              )}
            </div>
          </article>
        </div>
        <div className="col-md-6 d-flex">
          <article className="sym-card-secondary flex-grow-1 sym-no-hover d-flex flex-column">
            <h2 className="sym-card-title">Hierarchy snapshot</h2>
            <div className="d-flex flex-column" style={{ gap: 'var(--core-spacing-8)' }}>
              <p className="sym-card-meta mb-0">Inline alerts — semantic variants</p>
              <div className="sym-alert sym-alert--primary">Primary — contextual notice on this workspace.</div>
              <div className="sym-alert sym-alert--success">Success — hierarchy sync completed.</div>
              <div className="sym-alert sym-alert--danger">Danger — blocking validation on parent link.</div>
              <div className="sym-alert sym-alert--info">Info — read-only snapshot from catalog.</div>
              <div className="sym-alert sym-alert--warning">Warning — stale branch data; refresh advised.</div>
            </div>
            <p className="sym-card-body-text">
              Secondary card complements the tabbed workspace: use for summaries, hierarchies, or
              read-only context — still token-driven spacing and typography.
            </p>
            <div
              className="d-flex flex-wrap align-items-center sym-stack-bottom"
              style={{ gap: 'var(--core-spacing-8)', marginTop: 'auto', paddingTop: 'var(--core-spacing-16)' }}
            >
              <button type="button" className="sym-btn-outlined-labeled">
                View graph
              </button>
              <button type="button" className="sym-btn-filled-primary">
                Link parent
              </button>
            </div>
          </article>
        </div>
      </div>

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
              role="tablist"
              aria-label="API modes"
            >
              {['Sync', 'Async'].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  className={`sym-pill${gridPill === i ? ' sym-pill--active' : ''}`}
                  aria-selected={gridPill === i}
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
              <SymIconTooltipButton className="sym-icon-btn sym-icon-btn--primary-card" aria-label="More">
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
    </div>
  )
}
