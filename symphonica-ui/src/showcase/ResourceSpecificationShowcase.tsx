import { useMemo, useRef, useState } from 'react'
import { SymHeaderCreateButton } from '../components/SymHeaderCreateButton'
import { SymPageCopyrightFooter } from '../components/SymPageCopyrightFooter'
import { SymTableCardSplitScroll } from '../components/SymTableCardSplitScroll'
import { SymTable } from '../components/SymTable'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'
import { useSymTableProgressiveLoad } from '../components/useSymTableProgressiveLoad'
import {
  buildResourceSpecificationCatalog,
  RESOURCE_SPECIFICATION_NMS,
  type ResourceSpecificationLifeCycleStatus,
} from '../data/resourceSpecificationMockData'

const RESOURCE_SPECIFICATION_CATALOG = buildResourceSpecificationCatalog()

function LifeCycleBadge({ status }: { status: ResourceSpecificationLifeCycleStatus }) {
  const variant =
    status === 'LAUNCHED' || status === 'ACTIVE'
      ? 'success'
      : status === 'RETIRED'
        ? 'danger'
        : 'info'
  return (
    <span className={`sym-badge sym-badge--${variant}`} aria-label={status}>
      {status}
    </span>
  )
}

function formatCell(value: string) {
  return value.trim() ? value : '\u00A0'
}

/** Resource Domain — Resource Specification dashboard (legacy UI reference + Symphonica table dashboard pattern). */
export function ResourceSpecificationShowcase() {
  const [codeFilter, setCodeFilter] = useState('')
  const [versionFilter, setVersionFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [nmsFilter, setNmsFilter] = useState('')

  const tablePanelRef = useRef<HTMLElement>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)

  const filteredCatalog = useMemo(() => {
    const codeQuery = codeFilter.trim().toLowerCase()
    const versionQuery = versionFilter.trim().toLowerCase()
    const nameQuery = nameFilter.trim().toLowerCase()
    return RESOURCE_SPECIFICATION_CATALOG.filter((row) => {
      if (codeQuery && !row.code.toLowerCase().includes(codeQuery)) return false
      if (versionQuery && !row.version.toLowerCase().includes(versionQuery)) return false
      if (nameQuery && !row.name.toLowerCase().includes(nameQuery)) return false
      if (nmsFilter && row.nms !== nmsFilter) return false
      return true
    })
  }, [codeFilter, versionFilter, nameFilter, nmsFilter])

  const {
    visibleRows,
    totalCount,
    hasMoreRows,
    handleLoadMore,
    tryLoadMoreFromScroll,
    handleTableBodyWheel,
    appendingRowIds,
  } = useSymTableProgressiveLoad(filteredCatalog, tablePanelRef, tableScrollRef, [
    codeFilter,
    versionFilter,
    nameFilter,
    nmsFilter,
  ])

  function clearFilters() {
    setCodeFilter('')
    setVersionFilter('')
    setNameFilter('')
    setNmsFilter('')
  }

  return (
    <div className="sym-page sym-resource-specification sym-page--table-dashboard">
      <div
        className={
          hasMoreRows
            ? 'sym-page__dashboard-stack sym-page__dashboard-stack--table-fill'
            : 'sym-page__dashboard-stack'
        }
      >
        <article className="sym-card-primary sym-card-primary--section-sticky sym-no-hover">
          <header className="sym-card-header">
            <div className="sym-card-header__top">
              <h1 className="sym-card-title">Resource Specifications</h1>
            </div>
            <div className="sym-card-header__bottom">
              <div className="sym-card-header__left">
                <div className="sym-card-header__filters" aria-label="Resource specification filters">
                  <button type="button" className="sym-btn-outlined-icon-only" aria-label="Refresh">
                    <span className="material-icons-outlined" aria-hidden>
                      refresh
                    </span>
                  </button>
                  <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                    <label className="visually-hidden" htmlFor="rs-filter-code">
                      Code
                    </label>
                    <input
                      id="rs-filter-code"
                      type="search"
                      className="form-control sym-form-control"
                      placeholder="Code"
                      autoComplete="off"
                      value={codeFilter}
                      onChange={(e) => setCodeFilter(e.target.value)}
                    />
                  </div>
                  <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                    <label className="visually-hidden" htmlFor="rs-filter-version">
                      Version
                    </label>
                    <input
                      id="rs-filter-version"
                      type="search"
                      className="form-control sym-form-control"
                      placeholder="Version"
                      autoComplete="off"
                      value={versionFilter}
                      onChange={(e) => setVersionFilter(e.target.value)}
                    />
                  </div>
                  <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                    <label className="visually-hidden" htmlFor="rs-filter-name">
                      Name
                    </label>
                    <input
                      id="rs-filter-name"
                      type="search"
                      className="form-control sym-form-control"
                      placeholder="Name"
                      autoComplete="off"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                  </div>
                  <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                    <label className="visually-hidden" htmlFor="rs-filter-nms">
                      NMS
                    </label>
                    <select
                      id="rs-filter-nms"
                      className="form-select sym-form-control"
                      value={nmsFilter}
                      onChange={(e) => setNmsFilter(e.target.value)}
                    >
                      <option value="">NMS</option>
                      {RESOURCE_SPECIFICATION_NMS.slice(1).map((nms) => (
                        <option key={nms} value={nms}>
                          {nms}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="sym-btn-outlined-icon-only"
                    aria-label="Clear filters"
                    onClick={clearFilters}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      cleaning_services
                    </span>
                  </button>
                </div>
              </div>
              <div className="sym-card-header__right">
                <SymHeaderCreateButton entityLabel="Resource Specification" />
              </div>
            </div>
          </header>
        </article>

        <article
          ref={tablePanelRef}
          className="sym-card-primary sym-card-primary--table-panel sym-no-hover"
        >
          <SymTableCardSplitScroll
            scrollRef={tableScrollRef}
            onBodyScroll={tryLoadMoreFromScroll}
            onBodyWheel={handleTableBodyWheel}
            headerTable={
              <SymTable className="sym-table--header-pane">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Version</th>
                    <th scope="col">Name</th>
                    <th scope="col">Base Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Creation Date</th>
                    <th scope="col">Last Date</th>
                    <th scope="col" className="sym-table__col--status">
                      Life Cycle Status
                    </th>
                    <th scope="col" className="sym-table__col--actions">
                      Actions
                    </th>
                  </tr>
                </thead>
              </SymTable>
            }
            bodyTable={
              <SymTable aria-label="Resource specifications">
                <tbody>
                  {visibleRows.map((row) => (
                    <tr
                      key={row.id}
                      data-row-id={row.id}
                      tabIndex={-1}
                      className={
                        appendingRowIds.has(row.id) ? 'sym-table__row--append-in' : undefined
                      }
                    >
                      <td>{row.code}</td>
                      <td>{row.version}</td>
                      <td>{row.name}</td>
                      <td>{row.baseType}</td>
                      <td>{row.description}</td>
                      <td>{formatCell(row.startDate)}</td>
                      <td>{formatCell(row.endDate)}</td>
                      <td>{formatCell(row.creationDate)}</td>
                      <td>{formatCell(row.lastDate)}</td>
                      <td className="sym-table__cell--status">
                        <LifeCycleBadge status={row.lifeCycleStatus} />
                      </td>
                      <td className="sym-table__cell--actions">
                        <div className="sym-table-actions">
                          <SymIconTooltipButton
                            className="sym-icon-btn sym-icon-btn--primary"
                            tooltip="Clone"
                            aria-label={`Clone ${row.name}`}
                          >
                            <span className="material-icons-outlined" aria-hidden>
                              content_copy
                            </span>
                          </SymIconTooltipButton>
                          <SymIconTooltipButton
                            className="sym-icon-btn sym-icon-btn--primary"
                            tooltip="Add workflow order spec relation"
                            aria-label={`Add workflow order spec relation for ${row.name}`}
                          >
                            <span className="material-icons-outlined" aria-hidden>
                              sync_alt
                            </span>
                          </SymIconTooltipButton>
                          <SymIconTooltipButton
                            className="sym-icon-btn sym-icon-btn--danger"
                            tooltip="Delete"
                            aria-label={`Delete ${row.name}`}
                          >
                            <span className="material-icons-outlined" aria-hidden>
                              delete_outline
                            </span>
                          </SymIconTooltipButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </SymTable>
            }
          />
          <footer className="sym-table-footer">
            <span />
            <div className="sym-table-footer__center">
              {hasMoreRows ? (
                <SymIconTooltipButton
                  className="sym-icon-btn sym-icon-btn--primary sym-table-footer__load-more"
                  aria-label="Load more items"
                  onClick={handleLoadMore}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    add
                  </span>
                </SymIconTooltipButton>
              ) : null}
            </div>
            <div className="sym-table-footer__counter">
              Showing {visibleRows.length} of {totalCount} items
            </div>
          </footer>
        </article>
      </div>
      <SymPageCopyrightFooter />
    </div>
  )
}
