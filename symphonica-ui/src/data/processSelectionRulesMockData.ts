export type ProcessSelectionRule = {
  id: string
  serviceSpecification: string
  actionType: string
  actionName: string
  description: string
  inventoryValidationFailAction: string
}

export const INVENTORY_VALIDATION_FAIL_OPTIONS = [
  'Fail the service order',
  'Cancel the service order',
  'Complete the service order',
  'Continue with workflow',
] as const

export const PROCESS_SELECTION_SERVICE_SPECS = [
  'RES_HSD_CFS - 1.0',
  'SWVC - 1.0',
  'ACCESS_E-LINE_SERVICE - 1.0',
  'EDGE - 1.0',
  'SIP - 1.0',
  'RESIDENTIAL_HSD - 1.0',
  'GEOCODING_SERVICE_CFS - 1.0',
  'RES_HSD_CFS - 2.0',
  'VOIP_TRUNK - 1.0',
] as const

export const PROCESS_SELECTION_ACTION_NAMES = [
  'New',
  'Delete',
  'Remove',
  'Reboot',
  'Modify',
  'Change',
  'RESUME',
] as const

export type ProcessSelectionActionName = (typeof PROCESS_SELECTION_ACTION_NAMES)[number]

/** Maps Action Name → Action Type (auto-filled, read-only in create/edit drawers). */
export const PROCESS_SELECTION_ACTION_NAME_TO_TYPE: Record<
  ProcessSelectionActionName,
  string
> = {
  New: 'ADD',
  Delete: 'DELETE',
  Remove: 'DELETE',
  Reboot: 'NO_CHANGE',
  Modify: 'MODIFY',
  Change: 'MODIFY',
  RESUME: 'RESUME',
}

export function resolveActionTypeForName(actionName: string): string {
  if (!actionName) return ''
  return (
    PROCESS_SELECTION_ACTION_NAME_TO_TYPE[actionName as ProcessSelectionActionName] ?? ''
  )
}

export function createEmptyProcessSelectionRule(): ProcessSelectionRule {
  return {
    id: '',
    serviceSpecification: '',
    actionType: '',
    actionName: '',
    description: '',
    inventoryValidationFailAction: INVENTORY_VALIDATION_FAIL_OPTIONS[0],
  }
}

/** Mock rows — Figma 2961:19589 (Dashboard Process Selection Rules). */
export const PROCESS_SELECTION_RULES: ProcessSelectionRule[] = [
  {
    id: 'psr-1',
    serviceSpecification: 'RES_HSD_CFS - 1.0',
    actionType: 'ADD',
    actionName: 'New',
    description: 'Initial provision and activation',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-2',
    serviceSpecification: 'SWVC - 1.0',
    actionType: 'ADD',
    actionName: 'New',
    description: 'SWVC Add',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-3',
    serviceSpecification: 'ACCESS_E-LINE_SERVICE - 1.0',
    actionType: 'ADD',
    actionName: 'New',
    description: 'Circuit setup and allocation',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-4',
    serviceSpecification: 'EDGE - 1.0',
    actionType: 'DELETE',
    actionName: 'Delete',
    description: 'Decommission Edge instance',
    inventoryValidationFailAction: 'Fail the service order',
  },
  {
    id: 'psr-5',
    serviceSpecification: 'ACCESS_E-LINE_SERVICE - 1.0',
    actionType: 'DELETE',
    actionName: 'Remove',
    description: 'Release network resources',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-6',
    serviceSpecification: 'SIP - 1.0',
    actionType: 'NO_CHANGE',
    actionName: 'Reboot',
    description: 'Remote device restart',
    inventoryValidationFailAction: 'Continue with workflow',
  },
  {
    id: 'psr-7',
    serviceSpecification: 'RESIDENTIAL_HSD - 1.0',
    actionType: 'MODIFY',
    actionName: 'Modify',
    description: 'Update plan and QoS attributes',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-8',
    serviceSpecification: 'GEOCODING_SERVICE_CFS - 1.0',
    actionType: 'RESUME',
    actionName: 'RESUME',
    description: 'Initialize CFS geocoding',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-9',
    serviceSpecification: 'RES_HSD_CFS - 2.0',
    actionType: 'MODIFY',
    actionName: 'Change',
    description: 'Speed profile upgrade',
    inventoryValidationFailAction: 'Complete the service order',
  },
  {
    id: 'psr-10',
    serviceSpecification: 'VOIP_TRUNK - 1.0',
    actionType: 'ADD',
    actionName: 'New',
    description: 'Provision trunk and routing profile',
    inventoryValidationFailAction: 'Complete the service order',
  },
]

export const PROCESS_SELECTION_RULES_TOTAL = 152

export type LogicOperator = 'AND' | 'OR' | 'NAND' | 'NOR' | 'NOT'

export type LogicOperatorBadgeRole = 'info' | 'success' | 'secondary' | 'danger' | 'process'

export const LOGIC_OPERATORS: LogicOperator[] = ['AND', 'OR', 'NAND', 'NOR', 'NOT']

export const LOGIC_OPERATOR_BADGE_ROLE: Record<LogicOperator, LogicOperatorBadgeRole> = {
  AND: 'info',
  OR: 'success',
  NAND: 'secondary',
  NOR: 'danger',
  NOT: 'process',
}

export type ConditionRuleRow = {
  kind: 'rule'
  id: string
  entity: string
  code: string
  operator: string
  value: string
}

export type ConditionRulesetNode = {
  kind: 'ruleset'
  id: string
  logicOperator: LogicOperator
  items: ConditionTreeItem[]
}

export type ConditionTreeItem = ConditionRuleRow | ConditionRulesetNode

export type ConditionRulesRoot = {
  logicOperator: LogicOperator
  items: ConditionTreeItem[]
}

export type ConditionRuleDraft = {
  id: string
  bpmCode: string
  description: string
  conditions: ConditionRulesRoot
  collapsed: boolean
  isSaved: boolean
  wasSaved: boolean
  /** 1-based execution index before the latest reorder; null when unchanged. */
  previousExecutionIndex: number | null
}

export const CONDITION_ENTITY_OPTIONS = [
  'EXTRA_VALUE',
  'SERVICE',
  'CUSTOMER',
  'LOCATION',
] as const

export const CONDITION_CODE_OPTIONS = [
  'version2',
  'region',
  'status',
  'vendor',
] as const

export const CONDITION_OPERATOR_OPTIONS = [
  'EQUAL',
  'NOT_EQUAL',
  'CONTAINS',
  'IN',
  'GREATER_THAN',
  'LESS_THAN',
] as const

function makeConditionId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createEmptyConditionRuleRow(): ConditionRuleRow {
  return {
    kind: 'rule',
    id: makeConditionId('cond-rule'),
    entity: '',
    code: '',
    operator: '',
    value: '',
  }
}

export function createEmptyRulesetNode(): ConditionRulesetNode {
  return {
    kind: 'ruleset',
    id: makeConditionId('cond-ruleset'),
    logicOperator: 'AND',
    items: [createEmptyConditionRuleRow()],
  }
}

export function createEmptyConditionsRoot(): ConditionRulesRoot {
  return {
    logicOperator: 'AND',
    items: [],
  }
}

export function getRulesetAtPath(
  root: ConditionRulesRoot,
  rulesetPath: number[],
): ConditionRulesRoot | ConditionRulesetNode {
  if (rulesetPath.length === 0) return root

  let items = root.items
  let current: ConditionTreeItem | undefined
  for (const index of rulesetPath) {
    current = items[index]
    if (current?.kind !== 'ruleset') return root
    items = current.items
  }

  return current?.kind === 'ruleset' ? current : root
}

function getRulesetItems(root: ConditionRulesRoot, rulesetPath: number[]): ConditionTreeItem[] {
  if (rulesetPath.length === 0) return root.items

  let items = root.items
  for (const index of rulesetPath) {
    const node = items[index]
    if (node?.kind !== 'ruleset') return []
    items = node.items
  }
  return items
}

function replaceItemsAtPath(
  root: ConditionRulesRoot,
  rulesetPath: number[],
  nextItems: ConditionTreeItem[],
): ConditionRulesRoot {
  if (rulesetPath.length === 0) {
    return { ...root, items: nextItems }
  }

  function replaceInList(items: ConditionTreeItem[], path: number[]): ConditionTreeItem[] {
    const [head, ...rest] = path
    return items.map((item, index) => {
      if (index !== head || item.kind !== 'ruleset') return item
      if (rest.length === 0) {
        return { ...item, items: nextItems }
      }
      return { ...item, items: replaceInList(item.items, rest) }
    })
  }

  return { ...root, items: replaceInList(root.items, rulesetPath) }
}

export function addItemToRuleset(
  root: ConditionRulesRoot,
  rulesetPath: number[],
  item: ConditionTreeItem,
): ConditionRulesRoot {
  const items = getRulesetItems(root, rulesetPath)
  return replaceItemsAtPath(root, rulesetPath, [...items, item])
}

export function removeItemAtPath(root: ConditionRulesRoot, itemPath: number[]): ConditionRulesRoot {
  if (itemPath.length === 0) return root
  const parentPath = itemPath.slice(0, -1)
  const index = itemPath[itemPath.length - 1]
  const items = getRulesetItems(root, parentPath)
  return replaceItemsAtPath(
    root,
    parentPath,
    items.filter((_, itemIndex) => itemIndex !== index),
  )
}

export function updateItemAtPath(
  root: ConditionRulesRoot,
  itemPath: number[],
  updater: (item: ConditionTreeItem) => ConditionTreeItem,
): ConditionRulesRoot {
  const parentPath = itemPath.slice(0, -1)
  const index = itemPath[itemPath.length - 1]
  const items = getRulesetItems(root, parentPath)
  const nextItems = items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
  return replaceItemsAtPath(root, parentPath, nextItems)
}

export function setRulesetOperator(
  root: ConditionRulesRoot,
  rulesetPath: number[],
  logicOperator: LogicOperator,
): ConditionRulesRoot {
  if (rulesetPath.length === 0) {
    return { ...root, logicOperator }
  }

  const parentPath = rulesetPath.slice(0, -1)
  const index = rulesetPath[rulesetPath.length - 1]
  const items = getRulesetItems(root, parentPath)
  const nextItems = items.map((item, itemIndex) =>
    itemIndex === index && item.kind === 'ruleset' ? { ...item, logicOperator } : item,
  )
  return replaceItemsAtPath(root, parentPath, nextItems)
}

export type RulePersistStatus = 'saved' | 'modified' | 'new'

export function getRulePersistStatus(rule: ConditionRuleDraft): RulePersistStatus {
  if (rule.isSaved) return 'saved'
  if (rule.wasSaved) return 'modified'
  return 'new'
}

export const RULE_STATUS_TOOLTIPS: Record<Exclude<RulePersistStatus, 'saved'>, string> = {
  modified: 'Unsaved changes',
  new: 'Newly added rule',
}

export const BPM_CODE_OPTIONS = [
  'CreateSDWANVirtualConnection_Versa',
  'HSD_Provisioning_v2',
  'SWVC_Activation',
  'E_LINE_Provision',
  'Edge_Decommission',
  'SIP_Trunk_Setup',
  'Residential_HSD_Modify',
] as const

export function createEmptyConditionRule(collapsed = false): ConditionRuleDraft {
  return {
    id: `rule-${Date.now()}`,
    bpmCode: '',
    description: '',
    conditions: createEmptyConditionsRoot(),
    collapsed,
    isSaved: false,
    wasSaved: false,
    previousExecutionIndex: null,
  }
}

const RULES_AND_CONDITIONS_STORAGE_PREFIX = 'symphonica:rules-and-conditions:'

export function normalizeConditionRule(rule: ConditionRuleDraft): ConditionRuleDraft {
  return {
    ...rule,
    conditions: rule.conditions ?? createEmptyConditionsRoot(),
  }
}

export function loadConditionRulesForSelection(selectionRuleId: string): ConditionRuleDraft[] {
  if (typeof sessionStorage === 'undefined') return []

  try {
    const raw = sessionStorage.getItem(`${RULES_AND_CONDITIONS_STORAGE_PREFIX}${selectionRuleId}`)
    if (!raw) return []

    const parsed = JSON.parse(raw) as ConditionRuleDraft[]
    if (!Array.isArray(parsed)) return []

    return parsed.map(normalizeConditionRule)
  } catch {
    return []
  }
}

export function saveConditionRulesForSelection(
  selectionRuleId: string,
  rules: ConditionRuleDraft[],
): void {
  if (typeof sessionStorage === 'undefined') return

  sessionStorage.setItem(
    `${RULES_AND_CONDITIONS_STORAGE_PREFIX}${selectionRuleId}`,
    JSON.stringify(rules.map(normalizeConditionRule)),
  )
}

export function clearConditionRulesForSelection(selectionRuleId: string): void {
  if (typeof sessionStorage === 'undefined') return

  sessionStorage.removeItem(`${RULES_AND_CONDITIONS_STORAGE_PREFIX}${selectionRuleId}`)
}

export function moveConditionRuleToIndex(
  rules: ConditionRuleDraft[],
  draggedRuleId: string,
  toIndex: number,
): ConditionRuleDraft[] {
  const fromIndex = rules.findIndex((rule) => rule.id === draggedRuleId)
  if (fromIndex === -1 || toIndex < 0 || toIndex >= rules.length || fromIndex === toIndex) {
    return rules
  }

  const next = [...rules]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

/** Live drag — insert before/after target row using pointer Y vs card midpoint. */
export function reorderConditionRuleByPointer(
  rules: ConditionRuleDraft[],
  draggedRuleId: string,
  targetRuleId: string,
  insertAfter: boolean,
): ConditionRuleDraft[] {
  const fromIndex = rules.findIndex((rule) => rule.id === draggedRuleId)
  const targetIndex = rules.findIndex((rule) => rule.id === targetRuleId)
  if (fromIndex === -1 || targetIndex === -1 || draggedRuleId === targetRuleId) return rules

  let toIndex = insertAfter ? targetIndex + 1 : targetIndex
  if (fromIndex < toIndex) toIndex -= 1

  return moveConditionRuleToIndex(rules, draggedRuleId, toIndex)
}

export function reorderConditionRulesWithPreviousIndex(
  rules: ConditionRuleDraft[],
  draggedRuleId: string,
  targetRuleId: string,
): ConditionRuleDraft[] {
  const fromIndex = rules.findIndex((rule) => rule.id === draggedRuleId)
  const toIndex = rules.findIndex((rule) => rule.id === targetRuleId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return rules

  const indexBeforeMove = new Map(rules.map((rule, index) => [rule.id, index + 1]))
  const next = moveConditionRuleToIndex(rules, draggedRuleId, toIndex)

  return next.map((rule, index) => {
    const currentIndex = index + 1
    const previousIndex = indexBeforeMove.get(rule.id)!
    return {
      ...rule,
      previousExecutionIndex: previousIndex === currentIndex ? null : previousIndex,
    }
  })
}

export function applyConditionRuleReorderOriginIndex(
  rules: ConditionRuleDraft[],
  draggedRuleId: string,
  originIndex: number,
): ConditionRuleDraft[] {
  const finalIndex = rules.findIndex((rule) => rule.id === draggedRuleId)
  if (finalIndex === -1 || finalIndex === originIndex) return rules

  const previousExecutionIndex = originIndex + 1
  return rules.map((rule) =>
    rule.id === draggedRuleId ? { ...rule, previousExecutionIndex } : rule,
  )
}
