import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditProcessSelectionRuleDrawer } from '../components/EditProcessSelectionRuleDrawer'
import { SymIconTooltipButton } from '../components/SymIconTooltipButton'
import { SymToastStack, useSymToasts } from '../components/SymToast'
import {
  createEmptyProcessSelectionRule,
  PROCESS_SELECTION_RULES,
  PROCESS_SELECTION_RULES_TOTAL,
  type ProcessSelectionRule,
} from '../data/processSelectionRulesMockData'

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

/** Workflow Domain — Process Selection Rules dashboard (Figma 2961:19589 + detail drawer 2996:55267). */
export function ProcessSelectionRulesShowcase() {
  const navigate = useNavigate()
  const [rules, setRules] = useState(PROCESS_SELECTION_RULES)
  const [serviceSpecSort, setServiceSpecSort] = useState<SortPhase>('idle')
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [isCreatingRule, setIsCreatingRule] = useState(false)
  const [highlightedRuleId, setHighlightedRuleId] = useState<string | null>(null)
  const drawerCloseRef = useRef<(() => void) | null>(null)
  const { toasts, pushToast, dismissToast } = useSymToasts()

  const rows = useMemo(() => {
    const copy = [...rules]
    if (serviceSpecSort === 'asc') {
      copy.sort((a, b) => a.serviceSpecification.localeCompare(b.serviceSpecification))
    } else if (serviceSpecSort === 'desc') {
      copy.sort((a, b) => b.serviceSpecification.localeCompare(a.serviceSpecification))
    }
    return copy
  }, [rules, serviceSpecSort])

  const selectedRule = useMemo(
    () => rules.find((row) => row.id === selectedRowId) ?? null,
    [rules, selectedRowId],
  )

  function cycleServiceSpecSort() {
    setServiceSpecSort((p) => (p === 'idle' ? 'asc' : p === 'asc' ? 'desc' : 'idle'))
  }

  function handleRowSelect(rowId: string) {
    if (selectedRowId === rowId && selectedRule) {
      drawerCloseRef.current?.()
      return
    }
    setSelectedRowId(rowId)
    setIsCreatingRule(false)
    setHighlightedRuleId((current) => (current !== null && rowId !== current ? null : current))
  }

  function handleCreateServiceSpec() {
    setSelectedRowId(null)
    setHighlightedRuleId(null)
    setIsCreatingRule(true)
  }

  function handleOpenRulesAndConditions(rule: ProcessSelectionRule) {
    navigate(`/process-selection-rules/${rule.id}/rules-and-conditions`)
  }

  function handleSaveRule(next: ProcessSelectionRule) {
    if (isCreatingRule) {
      const id = `psr-${Date.now()}`
      const created = { ...next, id }
      setRules((prev) => [created, ...prev])
      setHighlightedRuleId(id)
      setServiceSpecSort('idle')
      setSelectedRowId(null)
      setIsCreatingRule(false)
      pushToast({
        variant: 'success',
        title: 'Service Specification successfully created!',
        durationMs: 4000,
      })
      return
    }
    setRules((prev) => prev.map((row) => (row.id === next.id ? next : row)))
    setHighlightedRuleId(next.id)
    setSelectedRowId(null)
    pushToast({
      variant: 'success',
      title: 'Changes successfully saved!',
      durationMs: 4000,
    })
  }

  function handleCloseDrawer() {
    setSelectedRowId(null)
    setIsCreatingRule(false)
  }

  const drawerRule =
    selectedRule ?? (isCreatingRule ? createEmptyProcessSelectionRule() : null)

  return (
    <div className="sym-page sym-process-selection-rules">
      <article className="sym-card-primary sym-card-primary--section-sticky sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">Process Selection Rules</h1>
          </div>
          <div className="sym-card-header__bottom">
            <div className="sym-card-header__left">
              <div className="sym-card-header__filters" aria-label="Process selection filters">
                <button type="button" className="sym-btn-outlined-icon-only" aria-label="Refresh">
                  <span className="material-icons-outlined" aria-hidden>
                    refresh
                  </span>
                </button>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="psr-filter-service-spec">
                    Service Spec
                  </label>
                  <select
                    id="psr-filter-service-spec"
                    className="form-select sym-form-control"
                    defaultValue=""
                  >
                    <option value="">Service Spec</option>
                  </select>
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="psr-filter-action-type">
                    Action Type
                  </label>
                  <select
                    id="psr-filter-action-type"
                    className="form-select sym-form-control"
                    defaultValue=""
                  >
                    <option value="">Action Type</option>
                  </select>
                </div>
                <div className="sym-card-header__filter-field sym-card-header__filter-field--primary-toolbar">
                  <label className="visually-hidden" htmlFor="psr-filter-bpm-code">
                    BPM Code
                  </label>
                  <select id="psr-filter-bpm-code" className="form-select sym-form-control" defaultValue="">
                    <option value="">BPM Code</option>
                  </select>
                </div>
                <button type="button" className="sym-btn-outlined-icon-only" aria-label="Clear filters">
                  <span className="material-icons-outlined" aria-hidden>
                    cleaning_services
                  </span>
                </button>
              </div>
            </div>
            <div className="sym-card-header__right">
              <button
                type="button"
                className="sym-btn-filled-primary"
                onClick={handleCreateServiceSpec}
              >
                <span className="material-icons-outlined" aria-hidden>
                  add
                </span>
                Create Service Spec
              </button>
            </div>
          </div>
        </header>
      </article>

      <article className="sym-card-primary sym-no-hover">
        <ProcessSelectionRulesTable
          rows={rows}
          selectedRowId={selectedRowId}
          highlightedRuleId={highlightedRuleId}
          serviceSpecSort={serviceSpecSort}
          onCycleServiceSpecSort={cycleServiceSpecSort}
          onRowSelect={handleRowSelect}
          onOpenRulesAndConditions={handleOpenRulesAndConditions}
        />
      </article>

      {drawerRule ? (
        <EditProcessSelectionRuleDrawer
          rule={drawerRule}
          mode={isCreatingRule ? 'create' : 'edit'}
          closeRequestRef={drawerCloseRef}
          onSave={handleSaveRule}
          onClose={handleCloseDrawer}
        />
      ) : null}

      <SymToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function ProcessSelectionRulesTable({
  rows,
  selectedRowId,
  highlightedRuleId,
  serviceSpecSort,
  onCycleServiceSpecSort,
  onRowSelect,
  onOpenRulesAndConditions,
}: {
  rows: ProcessSelectionRule[]
  selectedRowId: string | null
  highlightedRuleId: string | null
  serviceSpecSort: SortPhase
  onCycleServiceSpecSort: () => void
  onRowSelect: (rowId: string) => void
  onOpenRulesAndConditions: (rule: ProcessSelectionRule) => void
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
      <table className="sym-table" aria-label="Process selection rules">
        <thead>
          <tr>
            <th scope="col">
              {sortableHeader('Service Specification', onCycleServiceSpecSort, serviceSpecSort)}
            </th>
            <th scope="col">{sortableHeader('Action Type')}</th>
            <th scope="col">{sortableHeader('Action Name')}</th>
            <th scope="col">{sortableHeader('Description')}</th>
            <th scope="col" style={{ width: 'var(--core-size-56)' }}>
              Actions
            </th>
            <th scope="col" className="sym-table__col--settings" aria-label="Table settings">
              <span className="material-icons-outlined" aria-hidden>
                more_horiz
              </span>
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
                  : row.id === highlightedRuleId
                    ? 'sym-table__row--new sym-table__row--interactive'
                    : 'sym-table__row--interactive'
              }
              onClick={() => onRowSelect(row.id)}
              aria-selected={row.id === selectedRowId}
            >
              <td>{row.serviceSpecification}</td>
              <td>{row.actionType}</td>
              <td>{row.actionName}</td>
              <td>{row.description}</td>
              <td className="sym-table__cell--actions">
                <div className="sym-table-actions" onClick={(e) => e.stopPropagation()}>
                  <SymIconTooltipButton
                    className="sym-icon-btn sym-icon-btn--primary"
                    tooltip="Rules and Conditions"
                    aria-label="Rules and Conditions"
                    onClick={() => onOpenRulesAndConditions(row)}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      rule
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
              <td className="sym-table__cell--settings" aria-hidden />
            </tr>
          ))}
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
        <div className="sym-table-footer__counter">
          Showing {rows.length} of {PROCESS_SELECTION_RULES_TOTAL} items
        </div>
      </footer>
    </>
  )
}
