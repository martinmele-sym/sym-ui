import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SymHeaderCreateButton } from '../components/SymHeaderCreateButton'
import { SymTable } from '../components/SymTable'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'
import {
  SymTableColumnSettings,
  useSymTableColumnVisibility,
  type SymTableColumnOption,
} from '../components/SymTableColumnSettings'
import {
  RESOURCE_INVENTORY_NMS,
  RESOURCE_INVENTORY_REGIONS,
  RESOURCE_INVENTORY_ROWS,
  RESOURCE_INVENTORY_SPECIFICATIONS,
  RESOURCE_INVENTORY_STATUS_COLUMN,
  RESOURCE_INVENTORY_TABLE_COLUMNS,
  RESOURCE_INVENTORY_TOTAL,
  type ResourceInventoryColumnId,
  type ResourceInventoryRow,
  type ResourceOperationalStatus,
} from '../data/resourceInventoryMockData'

const RESOURCE_INVENTORY_COLUMN_OPTIONS: SymTableColumnOption[] =
  RESOURCE_INVENTORY_TABLE_COLUMNS.map((column) => ({ ...column }))

type SortPhase = 'idle' | 'asc' | 'desc'

function SortIcon({ phase }: { phase: SortPhase }) {
  const name =
    phase === 'asc' ? 'arrow_upward' : phase === 'desc' ? 'arrow_downward' : 'import_export'
  return (
    <span className="material-icons-outlined" aria-hidden>
      {name}
    </span>
  )
}

function StatusBadge({ status }: { status: ResourceOperationalStatus }) {
  const variant =
    status === 'UP' ? 'success' : status === 'DOWN' ? 'danger' : 'info'
  return (
    <span className={`sym-badge sym-badge--${variant}`} aria-label={status}>
      {status}
    </span>
  )
}

/** Resource Domain — Resource Inventory dashboard POC (Figma QarS99TuWgzjkkKqGdOhm2 / 5588:24930). */
export function ResourceInventoryShowcase() {
  const [nameFilter, setNameFilter] = useState('')
  const [publicIdFilter, setPublicIdFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [specFilter, setSpecFilter] = useState('')
  const [nmsFilter, setNmsFilter] = useState('')
  const [nameSort, setNameSort] = useState<SortPhase>('idle')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const columnVisibility = useSymTableColumnVisibility(RESOURCE_INVENTORY_COLUMN_OPTIONS)

  const filteredRows = useMemo(() => {
    const nameQuery = nameFilter.trim().toLowerCase()
    const publicIdQuery = publicIdFilter.trim().toLowerCase()
    let copy = RESOURCE_INVENTORY_ROWS.filter((row) => {
      if (nameQuery && !row.name.toLowerCase().includes(nameQuery)) return false
      if (publicIdQuery && !row.publicIdentifier.toLowerCase().includes(publicIdQuery)) return false
      if (specFilter && row.specification !== specFilter) return false
      return true
    })
    if (nameSort === 'asc') {
      copy = [...copy].sort((a, b) => a.name.localeCompare(b.name))
    } else if (nameSort === 'desc') {
      copy = [...copy].sort((a, b) => b.name.localeCompare(a.name))
    }
    return copy
  }, [nameFilter, publicIdFilter, specFilter, nameSort])

  const allVisibleSelected =
    filteredRows.length > 0 && filteredRows.every((row) => selectedIds.has(row.id))
  const someVisibleSelected =
    filteredRows.some((row) => selectedIds.has(row.id)) && !allVisibleSelected

  function cycleNameSort() {
    setNameSort((p) => (p === 'idle' ? 'asc' : p === 'asc' ? 'desc' : 'idle'))
  }

  function clearFilters() {
    setNameFilter('')
    setPublicIdFilter('')
    setRegionFilter('')
    setSpecFilter('')
    setNmsFilter('')
    setNameSort('idle')
  }

  function toggleRowSelection(rowId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filteredRows.forEach((row) => next.delete(row.id))
        return next
      })
      return
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredRows.forEach((row) => next.add(row.id))
      return next
    })
  }

  const sortableHeader = (label: string, onSort?: () => void, sortPhase?: SortPhase) =>
    onSort ? (
      <button type="button" className="sym-table__sort" onClick={onSort} aria-label={`Sort by ${label}`}>
        {label}
        <SortIcon phase={sortPhase ?? 'idle'} />
      </button>
    ) : (
      label
    )

  return (
    <div className="sym-page sym-resource-inventory">
      <article className="sym-card-primary sym-card-primary--section-sticky sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">Resource Inventory</h1>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <div className="sym-card-header__filters" aria-label="Resource inventory filters">
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
                  <label className="visually-hidden" htmlFor="ri-filter-name">
                    Name
                  </label>
                  <input
                    id="ri-filter-name"
                    type="search"
                    className="form-control sym-form-control"
                    placeholder="Name"
                    autoComplete="off"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="ri-filter-public-id">
                    Public identifier
                  </label>
                  <input
                    id="ri-filter-public-id"
                    type="search"
                    className="form-control sym-form-control"
                    placeholder="Public identifier"
                    autoComplete="off"
                    value={publicIdFilter}
                    onChange={(e) => setPublicIdFilter(e.target.value)}
                  />
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="ri-filter-regions">
                    Regions
                  </label>
                  <select
                    id="ri-filter-regions"
                    className="form-select sym-form-control"
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                  >
                    <option value="">Regions</option>
                    {RESOURCE_INVENTORY_REGIONS.slice(1).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="ri-filter-spec">
                    Resource Specification
                  </label>
                  <select
                    id="ri-filter-spec"
                    className="form-select sym-form-control"
                    value={specFilter}
                    onChange={(e) => setSpecFilter(e.target.value)}
                  >
                    <option value="">Resource Specification</option>
                    {RESOURCE_INVENTORY_SPECIFICATIONS.slice(1).map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="ri-filter-nms">
                    NMS
                  </label>
                  <select
                    id="ri-filter-nms"
                    className="form-select sym-form-control"
                    value={nmsFilter}
                    onChange={(e) => setNmsFilter(e.target.value)}
                  >
                    <option value="">NMS</option>
                    {RESOURCE_INVENTORY_NMS.slice(1).map((nms) => (
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
              <SymHeaderCreateButton entityLabel="Resource" />
            </div>
          </div>
        </header>
      </article>

      <article className="sym-card-primary sym-no-hover">
        <ResourceInventoryTable
          rows={filteredRows}
          selectedIds={selectedIds}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          nameSort={nameSort}
          onCycleNameSort={cycleNameSort}
          onToggleSelectAll={toggleSelectAllVisible}
          onToggleRow={toggleRowSelection}
          sortableHeader={sortableHeader}
          columnVisibility={columnVisibility.visibility}
          onToggleColumn={columnVisibility.toggleColumn}
          isColumnVisible={columnVisibility.isColumnVisible}
        />
      </article>
    </div>
  )
}

function renderResourceInventoryCell(
  columnId: ResourceInventoryColumnId,
  row: ResourceInventoryRow,
) {
  switch (columnId) {
    case 'name':
      return row.name
    case 'publicIdentifier':
      return row.publicIdentifier
    case 'specification':
      return row.specification
    case 'lifeCycleStatus':
      return row.lifeCycleStatus
    case 'hostname':
      return row.hostname
    case 'ipAddress':
      return row.ipAddress
    case 'port':
      return row.port
    case 'customerId':
    case 'connection':
    case 'category':
      return '\u00A0'
    default:
      return null
  }
}

function ResourceInventoryTable({
  rows,
  selectedIds,
  allVisibleSelected,
  someVisibleSelected,
  nameSort,
  onCycleNameSort,
  onToggleSelectAll,
  onToggleRow,
  sortableHeader,
  columnVisibility,
  onToggleColumn,
  isColumnVisible,
}: {
  rows: ResourceInventoryRow[]
  selectedIds: Set<string>
  allVisibleSelected: boolean
  someVisibleSelected: boolean
  nameSort: SortPhase
  onCycleNameSort: () => void
  onToggleSelectAll: () => void
  onToggleRow: (rowId: string) => void
  sortableHeader: (label: string, onSort?: () => void, sortPhase?: SortPhase) => ReactNode
  columnVisibility: Record<string, boolean>
  onToggleColumn: (columnId: string) => void
  isColumnVisible: (columnId: string) => boolean
}) {
  const selectAllRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected
    }
  }, [someVisibleSelected])

  const visibleColumns = RESOURCE_INVENTORY_TABLE_COLUMNS.filter((column) =>
    isColumnVisible(column.id),
  )

  return (
    <>
      <SymTable aria-label="Resource inventory">
        <thead>
          <tr>
            <th scope="col" className="sym-table__col--checkbox">
              <div className="form-check sym-table__checkbox">
                <input
                  className="form-check-input sym-table__checkbox-input"
                  type="checkbox"
                  aria-label="Select all resources"
                  checked={allVisibleSelected}
                  ref={selectAllRef}
                  onChange={onToggleSelectAll}
                />
              </div>
            </th>
            {visibleColumns.map((column) => (
              <th key={column.id} scope="col">
                {column.id === 'name'
                  ? sortableHeader(column.label, onCycleNameSort, nameSort)
                  : sortableHeader(column.label)}
              </th>
            ))}
            <th scope="col" className="sym-table__col--status">
              {sortableHeader(RESOURCE_INVENTORY_STATUS_COLUMN.label)}
            </th>
            <th scope="col" className="sym-table__col--actions">
              Actions
            </th>
            <th scope="col" className="sym-table__col--settings">
              <SymTableColumnSettings
                columns={RESOURCE_INVENTORY_COLUMN_OPTIONS}
                visibility={columnVisibility}
                onToggleColumn={onToggleColumn}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="sym-table__cell--checkbox">
                <div className="form-check sym-table__checkbox">
                  <input
                    className="form-check-input sym-table__checkbox-input"
                    type="checkbox"
                    aria-label={`Select ${row.name}`}
                    checked={selectedIds.has(row.id)}
                    onChange={() => onToggleRow(row.id)}
                  />
                </div>
              </td>
              {visibleColumns.map((column) => (
                <td key={column.id}>{renderResourceInventoryCell(column.id, row)}</td>
              ))}
              <td className="sym-table__cell--status">
                <StatusBadge status={row.status} />
              </td>
              <td className="sym-table__cell--actions">
                <div className="sym-table-actions">
                  <SymIconTooltipButton
                    className="sym-icon-btn sym-icon-btn--primary"
                    tooltip="View"
                    aria-label={`View ${row.name}`}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      visibility
                    </span>
                  </SymIconTooltipButton>
                  <SymIconTooltipButton
                    className="sym-icon-btn sym-icon-btn--primary"
                    tooltip="Open in new window"
                    aria-label={`Open ${row.name} in new window`}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      open_in_new
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
              <td className="sym-table__cell--settings" aria-hidden />
            </tr>
          ))}
        </tbody>
      </SymTable>
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
        <div className="sym-table-footer__counter">
          Showing {rows.length} of {RESOURCE_INVENTORY_TOTAL} items
        </div>
      </footer>
    </>
  )
}
