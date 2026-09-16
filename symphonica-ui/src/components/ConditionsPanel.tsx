import {
  addItemToRuleset,
  CONDITION_CODE_OPTIONS,
  CONDITION_ENTITY_OPTIONS,
  CONDITION_OPERATOR_OPTIONS,
  createEmptyConditionRuleRow,
  createEmptyRulesetNode,
  getRulesetAtPath,
  LOGIC_OPERATOR_BADGE_ROLE,
  LOGIC_OPERATORS,
  removeItemAtPath,
  setRulesetOperator,
  updateItemAtPath,
  type ConditionRuleRow,
  type ConditionRulesRoot,
  type LogicOperator,
} from '../data/processSelectionRulesMockData'
import { SymIconTooltipButton } from './SymIconTooltipButton'

type ConditionsPanelProps = {
  conditions: ConditionRulesRoot
  onChange: (next: ConditionRulesRoot) => void
}

type RulesetViewProps = {
  conditions: ConditionRulesRoot
  rulesetPath: number[]
  isRoot: boolean
  onChange: (next: ConditionRulesRoot) => void
}

type RuleRowViewProps = {
  rule: ConditionRuleRow
  itemPath: number[]
  onChange: (next: ConditionRulesRoot) => void
  conditions: ConditionRulesRoot
}

function LogicOperatorSelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: LogicOperator
  onChange: (next: LogicOperator) => void
  ariaLabel: string
}) {
  const role = LOGIC_OPERATOR_BADGE_ROLE[value]

  return (
    <select
      className={`form-select sym-form-control sym-conditions-logic-select sym-conditions-logic-select--${role}`}
      value={value}
      onChange={(event) => onChange(event.target.value as LogicOperator)}
      aria-label={ariaLabel}
    >
      {LOGIC_OPERATORS.map((operator) => (
        <option key={operator} value={operator}>
          {operator}
        </option>
      ))}
    </select>
  )
}

function ConditionRuleRowView({ rule, itemPath, conditions, onChange }: RuleRowViewProps) {
  function patchRule(patch: Partial<Omit<ConditionRuleRow, 'kind' | 'id'>>) {
    onChange(
      updateItemAtPath(conditions, itemPath, (item) => {
        if (item.kind !== 'rule') return item
        const next = { ...item, ...patch }
        if (patch.entity !== undefined && patch.entity !== item.entity) {
          next.code = ''
          next.operator = ''
          next.value = ''
        } else if (patch.code !== undefined && patch.code !== item.code) {
          next.operator = ''
          next.value = ''
        } else if (patch.operator !== undefined && patch.operator !== item.operator) {
          next.value = ''
        }
        return next
      }),
    )
  }

  function handleRemove() {
    onChange(removeItemAtPath(conditions, itemPath))
  }

  const codeEnabled = rule.entity.length > 0
  const operatorEnabled = codeEnabled && rule.code.length > 0
  const valueEnabled = operatorEnabled && rule.operator.length > 0

  return (
    <div className="sym-conditions-rule-row">
      <div className="sym-conditions-rule-row__field">
        <select
          className="form-select sym-form-control sym-form-control--compact"
          value={rule.entity}
          onChange={(event) => patchRule({ entity: event.target.value })}
          aria-label="Entity"
        >
          <option value="">* Entity</option>
          {CONDITION_ENTITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="sym-conditions-rule-row__field">
        <select
          className={`form-select sym-form-control sym-form-control--compact${codeEnabled ? '' : ' sym-form-control--muted'}`}
          value={rule.code}
          onChange={(event) => patchRule({ code: event.target.value })}
          aria-label="Code"
          disabled={!codeEnabled}
        >
          <option value="">* Code</option>
          {CONDITION_CODE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="sym-conditions-rule-row__field">
        <select
          className={`form-select sym-form-control sym-form-control--compact${operatorEnabled ? '' : ' sym-form-control--muted'}`}
          value={rule.operator}
          onChange={(event) => patchRule({ operator: event.target.value })}
          aria-label="Operator"
          disabled={!operatorEnabled}
        >
          <option value="">* Operator</option>
          {CONDITION_OPERATOR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="sym-conditions-rule-row__field">
        <input
          type="text"
          className={`form-control sym-form-control sym-form-control--compact${valueEnabled ? '' : ' sym-form-control--muted'}`}
          value={rule.value}
          onChange={(event) => patchRule({ value: event.target.value })}
          placeholder="* Value"
          aria-label="Value"
          disabled={!valueEnabled}
        />
      </div>
      <SymIconTooltipButton
        className="sym-icon-btn sym-icon-btn--primary-card"
        tooltip="Remove Rule"
        aria-label="Remove Rule"
        onClick={handleRemove}
      >
        <span className="material-icons-outlined" aria-hidden>
          close
        </span>
      </SymIconTooltipButton>
    </div>
  )
}

function RulesetView({ conditions, rulesetPath, isRoot, onChange }: RulesetViewProps) {
  const ruleset = getRulesetAtPath(conditions, rulesetPath)
  const items = ruleset.items
  const operator = ruleset.logicOperator

  const showEmptyState = isRoot && items.length === 0

  function handleOperatorChange(nextOperator: LogicOperator) {
    onChange(setRulesetOperator(conditions, rulesetPath, nextOperator))
  }

  function handleAddRule() {
    onChange(addItemToRuleset(conditions, rulesetPath, createEmptyConditionRuleRow()))
  }

  function handleAddRuleset() {
    onChange(addItemToRuleset(conditions, rulesetPath, createEmptyRulesetNode()))
  }

  function handleRemoveRuleset() {
    onChange(removeItemAtPath(conditions, rulesetPath))
  }

  const toolbar = (
    <div className="sym-conditions-ruleset__toolbar">
      <LogicOperatorSelect
        value={operator}
        onChange={handleOperatorChange}
        ariaLabel={isRoot ? 'Root condition logic operator' : 'Ruleset logic operator'}
      />
      <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={handleAddRule}>
        <span className="material-icons-outlined" aria-hidden>
          add
        </span>
        Rule
      </button>
      <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={handleAddRuleset}>
        <span className="material-icons-outlined" aria-hidden>
          add
        </span>
        Ruleset
      </button>
      {!isRoot ? (
        <SymIconTooltipButton
          className="sym-btn-outlined-icon-only sym-conditions-panel__remove-ruleset"
          tooltip="Remove Ruleset"
          aria-label="Remove Ruleset"
          onClick={handleRemoveRuleset}
        >
          <span className="material-icons-outlined" aria-hidden>
            close
          </span>
        </SymIconTooltipButton>
      ) : null}
      {showEmptyState ? (
        <p className="sym-conditions-panel__empty">
          No conditions defined yet. Add a rule or ruleset to start.
        </p>
      ) : null}
    </div>
  )

  const body = (
    <div className="sym-conditions-ruleset__body">
      {items.map((item, index) => {
        const itemPath = [...rulesetPath, index]
        if (item.kind === 'rule') {
          return (
            <ConditionRuleRowView
              key={item.id}
              rule={item}
              itemPath={itemPath}
              conditions={conditions}
              onChange={onChange}
            />
          )
        }

        return (
          <RulesetView
            key={item.id}
            conditions={conditions}
            rulesetPath={itemPath}
            isRoot={false}
            onChange={onChange}
          />
        )
      })}
    </div>
  )

  if (isRoot) {
    return (
      <div
        className={`sym-conditions-ruleset sym-conditions-ruleset--root${showEmptyState ? ' sym-conditions-ruleset--empty' : ''}`}
      >
        {toolbar}
        {showEmptyState ? null : body}
      </div>
    )
  }

  return (
    <div className="sym-conditions-ruleset sym-conditions-ruleset--nested">
      <div className="sym-conditions-ruleset__indent" aria-hidden>
        <span className="material-icons-outlined sym-conditions-ruleset__branch-icon">
          subdirectory_arrow_right
        </span>
      </div>
      <div className="sym-conditions-ruleset__content">
        {toolbar}
        {body}
      </div>
    </div>
  )
}

export function ConditionsPanel({ conditions, onChange }: ConditionsPanelProps) {
  return (
    <section className="sym-conditions-panel" aria-label="Rule conditions">
      <RulesetView conditions={conditions} rulesetPath={[]} isRoot onChange={onChange} />
    </section>
  )
}
