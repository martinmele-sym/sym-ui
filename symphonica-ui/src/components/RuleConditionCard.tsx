import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import {
  BPM_CODE_OPTIONS,
  getRulePersistStatus,
  RULE_STATUS_TOOLTIPS,
  type ConditionRuleDraft,
  type ConditionRulesRoot,
} from '../data/processSelectionRulesMockData'
import { ConditionsPanel } from './ConditionsPanel'
import { SymIconTooltipButton } from './SymIconTooltipButton'

export type RuleConditionCardChangeHandler = (
  updater: (prev: ConditionRuleDraft) => ConditionRuleDraft,
) => void

type RuleConditionCardProps = {
  index: number
  rule: ConditionRuleDraft
  onChange: RuleConditionCardChangeHandler
  onDelete: () => void
  isDragging?: boolean
  isDragOver?: boolean
  onReorderPointerDown: (event: ReactPointerEvent<HTMLElement>, cardElement: HTMLElement) => void
}

export function RuleConditionCard({
  index,
  rule,
  onChange,
  onDelete,
  isDragging = false,
  isDragOver = false,
  onReorderPointerDown,
}: RuleConditionCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const persistStatus = getRulePersistStatus(rule)
  const showCondensedStatus = rule.collapsed && persistStatus !== 'saved'

  function patch<K extends keyof ConditionRuleDraft>(key: K, value: ConditionRuleDraft[K]) {
    onChange((prev) => {
      const next: ConditionRuleDraft = { ...prev, [key]: value }
      if (prev.isSaved && (key === 'bpmCode' || key === 'description' || key === 'conditions')) {
        next.isSaved = false
      }
      return next
    })
  }

  function handleConditionsChange(nextConditions: ConditionRulesRoot) {
    patch('conditions', nextConditions)
  }

  function toggleCollapsed() {
    onChange((prev) => ({ ...prev, collapsed: !prev.collapsed }))
  }

  function handleReorderPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const card = cardRef.current
    if (!card) return
    onReorderPointerDown(event, card)
  }

  const cardClassName = [
    'sym-card-primary',
    'sym-rule-card',
    rule.collapsed ? 'sym-rule-card--collapsed' : '',
    rule.isSaved ? 'sym-rule-card--saved' : '',
    persistStatus === 'modified' && rule.collapsed ? 'sym-rule-card--modified' : '',
    persistStatus === 'new' && rule.collapsed ? 'sym-rule-card--new' : '',
    isDragging ? 'sym-rule-card--dragging' : '',
    isDragOver ? 'sym-rule-card--drag-over' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      ref={cardRef}
      className={cardClassName}
      data-rule-id={rule.id}
      role="listitem"
    >
      <div
        role="button"
        tabIndex={0}
        className="sym-rule-card__drag-handle"
        aria-label={`Reorder rule ${index}`}
        onPointerDown={handleReorderPointerDown}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
          }
        }}
      >
        <span className="material-icons-outlined sym-rule-card__drag-handle-icon" aria-hidden>
          drag_indicator
        </span>
      </div>

      <div className="sym-rule-card__content">
        <header className="sym-rule-card__header">
          {showCondensedStatus ? (
            <SymIconTooltipButton
              className={`sym-icon-btn sym-rule-card__status-icon-btn sym-rule-card__status-icon--${persistStatus}`}
              tooltip={RULE_STATUS_TOOLTIPS[persistStatus]}
              aria-label={RULE_STATUS_TOOLTIPS[persistStatus]}
            >
              <span className="material-icons-outlined" aria-hidden>
                {persistStatus === 'modified' ? 'error_outline' : 'info'}
              </span>
            </SymIconTooltipButton>
          ) : null}
          <div
            role="button"
            tabIndex={0}
            className="sym-rule-card__header-main sym-rule-card__header-toggle"
            aria-expanded={!rule.collapsed}
            aria-label={rule.collapsed ? 'Expand rule' : 'Collapse rule'}
            onClick={toggleCollapsed}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleCollapsed()
              }
            }}
          >
            <span className="sym-rule-card__index-group">
              <span
                className={`sym-rule-card__index${persistStatus === 'new' && rule.collapsed ? ' sym-rule-card__index--draft' : ''}`}
              >
                {index}.
              </span>
              {rule.previousExecutionIndex !== null ? (
                <span className="sym-rule-card__previous-index" aria-label={`Previously position ${rule.previousExecutionIndex}`}>
                  ({rule.previousExecutionIndex})
                </span>
              ) : null}
            </span>
            {rule.isSaved ? (
              <div className="sym-rule-card__heading">
                <div className="sym-rule-card__title-row">
                  <h2 className="sym-rule-card__title">{rule.bpmCode}</h2>
                  <div
                    className="sym-rule-card__header-link-actions"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <SymIconTooltipButton
                      className="sym-icon-btn sym-rule-card__header-link-btn"
                      tooltip="Open BPM definition"
                      aria-label="Open BPM definition"
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        open_in_new
                      </span>
                    </SymIconTooltipButton>
                    <SymIconTooltipButton
                      className="sym-icon-btn sym-rule-card__header-link-btn"
                      tooltip="View process"
                      aria-label="View process"
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        account_tree
                      </span>
                    </SymIconTooltipButton>
                  </div>
                </div>
                {rule.description ? (
                  <p className="sym-rule-card__subtitle">{rule.description}</p>
                ) : null}
              </div>
            ) : (
              <h2
                className={`sym-rule-card__title${persistStatus === 'new' && rule.collapsed ? ' sym-rule-card__title--draft' : ''}`}
              >
                Newly added rule
              </h2>
            )}
          </div>
          <div className="sym-rule-card__header-actions">
            <SymIconTooltipButton
              className="sym-icon-btn sym-icon-btn--danger-card"
              tooltip="Delete"
              aria-label="Delete rule"
              onClick={onDelete}
            >
              <span className="material-icons-outlined" aria-hidden>
                delete_outline
              </span>
            </SymIconTooltipButton>
            <SymIconTooltipButton
              className="sym-icon-btn sym-icon-btn--primary-card"
              tooltip={rule.collapsed ? 'Expand rule' : 'Collapse rule'}
              aria-label={rule.collapsed ? 'Expand rule' : 'Collapse rule'}
              aria-expanded={!rule.collapsed}
              onClick={toggleCollapsed}
            >
              <span className="material-icons-outlined" aria-hidden>
                {rule.collapsed ? 'expand_more' : 'expand_less'}
              </span>
            </SymIconTooltipButton>
          </div>
        </header>

        {!rule.collapsed ? (
          <div className="sym-rule-card__body">
            <div className="sym-rule-card__fields">
              <div className="sym-rule-card__field">
                <label className="sym-rule-card__label" htmlFor={`${rule.id}-bpm-code`}>
                  BPM Code
                  <span className="sym-rule-card__required" aria-hidden>
                    *
                  </span>
                </label>
                <select
                  id={`${rule.id}-bpm-code`}
                  className="form-select sym-form-control"
                  value={rule.bpmCode}
                  onChange={(e) => patch('bpmCode', e.target.value)}
                  required
                >
                  <option value="">Please select</option>
                  {BPM_CODE_OPTIONS.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sym-rule-card__field">
                <label className="sym-rule-card__label" htmlFor={`${rule.id}-description`}>
                  Description
                </label>
                <input
                  id={`${rule.id}-description`}
                  type="text"
                  className="form-control sym-form-control"
                  placeholder="Enter description"
                  value={rule.description}
                  onChange={(e) => patch('description', e.target.value)}
                />
              </div>
            </div>

            <ConditionsPanel conditions={rule.conditions} onChange={handleConditionsChange} />
          </div>
        ) : null}
      </div>
    </article>
  )
}
