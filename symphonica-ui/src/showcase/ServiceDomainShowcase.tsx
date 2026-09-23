import { useMemo, useRef, useState } from 'react'
import { EditCharacteristicDrawer } from '../components/EditCharacteristicDrawer'
import { SymTable } from '../components/SymTable'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'
import {
  createEmptyServiceSpecCharacteristic,
  SERVICE_SPEC_CHARACTERISTICS,
  SERVICE_SPEC_PILL_LABELS,
  type ServiceSpecCharacteristic,
} from '../data/serviceDomainMockData'

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

function boolLabel(value: boolean): string {
  return value ? 'true' : 'false'
}

/** Service Domain POC — classic Symphonica dashboard (§5.5 sticky header + primary table card). Figma 968:45029. */
export function ServiceDomainShowcase() {
  const [activePill, setActivePill] = useState(1)
  const [nameSort, setNameSort] = useState<SortPhase>('idle')
  const [characteristics, setCharacteristics] = useState(SERVICE_SPEC_CHARACTERISTICS)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [isAddingCharacteristic, setIsAddingCharacteristic] = useState(false)
  const [highlightedCharacteristicId, setHighlightedCharacteristicId] = useState<string | null>(
    null,
  )
  const [drawerPanel, setDrawerPanel] = useState<'edit' | 'values'>('edit')
  const [drawerEntryPanel, setDrawerEntryPanel] = useState<'edit' | 'values'>('edit')
  const drawerCloseRef = useRef<(() => void) | null>(null)

  const rows = useMemo(() => {
    const copy = [...characteristics]
    if (nameSort === 'asc') {
      copy.sort((a, b) => a.name.localeCompare(b.name))
    } else if (nameSort === 'desc') {
      copy.sort((a, b) => b.name.localeCompare(a.name))
    }
    return copy
  }, [characteristics, nameSort])

  const selectedCharacteristic = useMemo(
    () => characteristics.find((row) => row.id === selectedRowId) ?? null,
    [characteristics, selectedRowId],
  )

  function cycleNameSort() {
    setNameSort((p) => (p === 'idle' ? 'asc' : p === 'asc' ? 'desc' : 'idle'))
  }

  function handleRowSelect(rowId: string) {
    if (selectedRowId === rowId && drawerCharacteristic) {
      drawerCloseRef.current?.()
      return
    }
    setSelectedRowId(rowId)
    setHighlightedCharacteristicId((current) =>
      current !== null && rowId !== current ? null : current,
    )
    setIsAddingCharacteristic(false)
    setDrawerPanel('edit')
    setDrawerEntryPanel('edit')
  }

  function handleOpenValues(rowId: string) {
    setSelectedRowId(rowId)
    setHighlightedCharacteristicId((current) =>
      current !== null && rowId !== current ? null : current,
    )
    setIsAddingCharacteristic(false)
    setDrawerPanel('values')
    setDrawerEntryPanel('values')
  }

  function handleAddCharacteristic() {
    setSelectedRowId(null)
    setHighlightedCharacteristicId(null)
    setIsAddingCharacteristic(true)
    setDrawerPanel('edit')
    setDrawerEntryPanel('edit')
  }

  function handleSaveCharacteristic(next: ServiceSpecCharacteristic) {
    if (isAddingCharacteristic) {
      const id = `characteristic-${Date.now()}`
      const created = { ...next, id }
      setCharacteristics((prev) => [created, ...prev])
      setHighlightedCharacteristicId(id)
      setNameSort('idle')
      setSelectedRowId(null)
      setIsAddingCharacteristic(false)
      setDrawerPanel('edit')
      return
    }
    setCharacteristics((prev) => prev.map((row) => (row.id === next.id ? next : row)))
    setHighlightedCharacteristicId(next.id)
    setSelectedRowId(null)
    setIsAddingCharacteristic(false)
    setDrawerPanel('edit')
  }

  function handleCloseDrawer() {
    setSelectedRowId(null)
    setIsAddingCharacteristic(false)
    setDrawerPanel('edit')
  }

  const drawerCharacteristic =
    selectedCharacteristic ?? (isAddingCharacteristic ? createEmptyServiceSpecCharacteristic() : null)

  return (
    <div className="sym-page sym-service-domain">
      <article className="sym-card-primary sym-card-primary--section-sticky sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">Create Service Specification</h1>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <button type="button" className="sym-btn-outlined-icon-only" aria-label="Back">
                <span className="material-icons-outlined" aria-hidden>
                  arrow_back
                </span>
              </button>
              <div
                className="d-flex flex-wrap align-items-center"
                style={{ gap: 'var(--core-spacing-8)' }}
                role="tablist"
                aria-label="Service specification steps"
              >
                {SERVICE_SPEC_PILL_LABELS.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={activePill === index}
                    className={`sym-pill${activePill === index ? ' sym-pill--active' : ''}`}
                    onClick={() => setActivePill(index)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sym-card-header__right">
              <button type="button" className="sym-btn-filled-primary">
                <span className="material-icons-outlined" aria-hidden>
                  save
                </span>
                Save
              </button>
            </div>
          </div>
        </header>
      </article>

      <article className="sym-card-primary sym-no-hover">
        <div className="sym-card-header__bottom sym-service-domain__table-toolbar">
          <div className="sym-card-header__left">
            <button
              type="button"
              className="sym-btn-filled-primary sym-btn--sm"
              onClick={handleAddCharacteristic}
            >
              <span className="material-icons-outlined" aria-hidden>
                add
              </span>
              Add Characteristic
            </button>
          </div>
          <div className="sym-card-header__right">
            <button type="button" className="sym-btn-outlined-labeled sym-btn--sm">
              <span className="material-icons-outlined" aria-hidden>
                arrow_back
              </span>
              Back
            </button>
            <button type="button" className="sym-btn-outlined-labeled sym-btn--sm">
              Next
              <span className="material-icons-outlined" aria-hidden>
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        <CharacteristicsTable
          rows={rows}
          selectedRowId={selectedRowId}
          highlightedCharacteristicId={highlightedCharacteristicId}
          nameSort={nameSort}
          onCycleNameSort={cycleNameSort}
          onRowSelect={handleRowSelect}
          onOpenValues={handleOpenValues}
        />
      </article>

      {drawerCharacteristic ? (
        <EditCharacteristicDrawer
          characteristic={drawerCharacteristic}
          mode={isAddingCharacteristic ? 'add' : 'edit'}
          initialPanel={drawerPanel}
          valuesExitClosesDrawer={drawerEntryPanel === 'values'}
          closeRequestRef={drawerCloseRef}
          onSave={handleSaveCharacteristic}
          onClose={handleCloseDrawer}
        />
      ) : null}
    </div>
  )
}

function CharacteristicsTable({
  rows,
  selectedRowId,
  highlightedCharacteristicId,
  nameSort,
  onCycleNameSort,
  onRowSelect,
  onOpenValues,
}: {
  rows: ServiceSpecCharacteristic[]
  selectedRowId: string | null
  highlightedCharacteristicId: string | null
  nameSort: SortPhase
  onCycleNameSort: () => void
  onRowSelect: (rowId: string) => void
  onOpenValues: (rowId: string) => void
}) {
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
    <>
      <SymTable aria-label="Service specification characteristics">
        <thead>
          <tr>
            <th scope="col">{sortableHeader('Name', onCycleNameSort, nameSort)}</th>
            <th scope="col">{sortableHeader('Value Type')}</th>
            <th scope="col">{sortableHeader('Configurable')}</th>
            <th scope="col">{sortableHeader('Mutable')}</th>
            <th scope="col">{sortableHeader('Unique')}</th>
            <th scope="col">{sortableHeader('SubCharacteristics')}</th>
            <th scope="col">{sortableHeader('Min Cardinality')}</th>
            <th scope="col">{sortableHeader('Max cardinality')}</th>
            <th scope="col" className="sym-table__col--actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={
                row.id === selectedRowId
                  ? 'sym-table__row--selected sym-table__row--interactive'
                  : row.id === highlightedCharacteristicId
                    ? 'sym-table__row--new sym-table__row--interactive'
                    : 'sym-table__row--interactive'
              }
              onClick={() => onRowSelect(row.id)}
              aria-selected={row.id === selectedRowId}
            >
              <td>{row.name}</td>
              <td>{row.valueType}</td>
              <td>{boolLabel(row.configurable)}</td>
              <td>{boolLabel(row.mutable)}</td>
              <td>{boolLabel(row.unique)}</td>
              <td>{boolLabel(row.subCharacteristics)}</td>
              <td>{row.minCardinality}</td>
              <td>{row.maxCardinality}</td>
              <td className="sym-table__cell--actions">
                <div className="sym-table-actions" onClick={(e) => e.stopPropagation()}>
                  <SymIconTooltipButton
                    className="sym-icon-btn sym-icon-btn--primary"
                    tooltip="Values"
                    aria-label="Values"
                    onClick={() => onOpenValues(row.id)}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      code
                    </span>
                  </SymIconTooltipButton>
                  <SymIconTooltipButton
                    className="sym-icon-btn sym-icon-btn--danger"
                    tooltip="Delete"
                    aria-label="Delete"
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
      <footer className="sym-table-footer">
        <span />
        <span />
        <div className="sym-table-footer__counter">
          Showing {rows.length} of {rows.length} items
        </div>
      </footer>
    </>
  )
}
