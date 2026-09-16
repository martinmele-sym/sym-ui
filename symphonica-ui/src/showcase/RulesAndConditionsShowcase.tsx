import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { RuleConditionCard } from '../components/RuleConditionCard'
import { SymToastStack, useSymToasts } from '../components/SymToast'
import {
  applyConditionRuleReorderOriginIndex,
  clearConditionRulesForSelection,
  createEmptyConditionRule,
  loadConditionRulesForSelection,
  PROCESS_SELECTION_RULES,
  reorderConditionRuleByPointer,
  saveConditionRulesForSelection,
  type ConditionRuleDraft,
  type ProcessSelectionRule,
} from '../data/processSelectionRulesMockData'

type RuleDragSession = {
  ruleId: string
  originIndex: number
  offsetX: number
  offsetY: number
}

type RuleDragTarget = {
  ruleId: string
  insertAfter: boolean
}

function findSelectionRule(ruleId: string | undefined): ProcessSelectionRule | undefined {
  if (!ruleId) return undefined
  return PROCESS_SELECTION_RULES.find((row) => row.id === ruleId)
}

function findRuleDropTarget(clientX: number, clientY: number, draggedRuleId: string): RuleDragTarget | null {
  const elements = document.elementsFromPoint(clientX, clientY)

  for (const element of elements) {
    const card = element.closest('[data-rule-id]') as HTMLElement | null
    if (!card) continue

    const ruleId = card.getAttribute('data-rule-id')
    if (!ruleId || ruleId === draggedRuleId) continue
    if (card.classList.contains('sym-rule-card--dragging')) continue

    const rect = card.getBoundingClientRect()
    return {
      ruleId,
      insertAfter: clientY > rect.top + rect.height / 2,
    }
  }

  return null
}

/** Rules and Conditions dashboard — Figma 2961:19600 + condensed stack 2968:15843. */
export function RulesAndConditionsShowcase() {
  const navigate = useNavigate()
  const { selectionRuleId } = useParams<{ selectionRuleId: string }>()
  const selectionRule = useMemo(() => findSelectionRule(selectionRuleId), [selectionRuleId])
  const [conditionRules, setConditionRules] = useState<ConditionRuleDraft[]>(() =>
    selectionRuleId ? loadConditionRulesForSelection(selectionRuleId) : [],
  )
  const [draggingRuleId, setDraggingRuleId] = useState<string | null>(null)
  const [dragOverRuleId, setDragOverRuleId] = useState<string | null>(null)
  const dragSessionRef = useRef<RuleDragSession | null>(null)
  const dragGhostRef = useRef<HTMLElement | null>(null)
  const lastDragTargetRef = useRef<RuleDragTarget | null>(null)
  const { toasts, pushToast, dismissToast } = useSymToasts()

  const canSave =
    conditionRules.some((rule) => !rule.isSaved && rule.bpmCode.length > 0) ||
    conditionRules.some((rule) => rule.previousExecutionIndex !== null)
  const allRulesCollapsed =
    conditionRules.length > 0 && conditionRules.every((rule) => rule.collapsed)

  useEffect(() => {
    if (!selectionRuleId) return
    setConditionRules(loadConditionRulesForSelection(selectionRuleId))
  }, [selectionRuleId])

  useEffect(() => {
    if (!selectionRuleId) return
    saveConditionRulesForSelection(selectionRuleId, conditionRules)
  }, [selectionRuleId, conditionRules])

  const finishRuleReorder = useCallback(() => {
    const session = dragSessionRef.current
    if (session && session.originIndex !== -1) {
      setConditionRules((prev) =>
        applyConditionRuleReorderOriginIndex(prev, session.ruleId, session.originIndex),
      )
    }

    dragGhostRef.current?.remove()
    dragGhostRef.current = null
    dragSessionRef.current = null
    lastDragTargetRef.current = null
    setDraggingRuleId(null)
    setDragOverRuleId(null)
    document.body.classList.remove('sym-rule-card-drag-active')
  }, [])

  const updateDragGhostPosition = useCallback((clientX: number, clientY: number) => {
    const session = dragSessionRef.current
    const ghost = dragGhostRef.current
    if (!session || !ghost) return

    ghost.style.transform = `translate(${clientX - session.offsetX}px, ${clientY - session.offsetY}px)`
  }, [])

  useEffect(() => {
    if (!draggingRuleId) return

    function onPointerMove(event: globalThis.PointerEvent) {
      const session = dragSessionRef.current
      if (!session) return

      updateDragGhostPosition(event.clientX, event.clientY)

      const target = findRuleDropTarget(event.clientX, event.clientY, session.ruleId)
      if (!target) {
        setDragOverRuleId(null)
        return
      }

      const lastTarget = lastDragTargetRef.current
      if (
        lastTarget?.ruleId === target.ruleId &&
        lastTarget.insertAfter === target.insertAfter
      ) {
        setDragOverRuleId(target.ruleId)
        return
      }

      lastDragTargetRef.current = target
      setConditionRules((prev) =>
        reorderConditionRuleByPointer(prev, session.ruleId, target.ruleId, target.insertAfter),
      )
      setDragOverRuleId(target.ruleId)
    }

    function onPointerUp() {
      finishRuleReorder()
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [draggingRuleId, finishRuleReorder, updateDragGhostPosition])

  if (!selectionRule) {
    return <Navigate to="/process-selection-rules" replace />
  }

  function handleCreateRule() {
    setConditionRules((prev) => [...prev, createEmptyConditionRule()])
  }

  function handleUpdateRule(
    ruleId: string,
    updater: (prev: ConditionRuleDraft) => ConditionRuleDraft,
  ) {
    setConditionRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? updater(rule) : rule)),
    )
  }

  function handleRefresh() {
    if (!selectionRuleId) return
    finishRuleReorder()
    clearConditionRulesForSelection(selectionRuleId)
    setConditionRules([])
  }

  function handleDeleteRule(ruleId: string) {
    setConditionRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  function handleSave() {
    if (!canSave) return

    setConditionRules((prev) =>
      prev.map((rule) =>
        rule.bpmCode.length > 0
          ? {
              ...rule,
              isSaved: true,
              wasSaved: true,
              collapsed: true,
              previousExecutionIndex: null,
            }
          : { ...rule, previousExecutionIndex: null },
      ),
    )

    pushToast({
      variant: 'success',
      title: 'Rule successfully saved!',
      durationMs: 4000,
    })
  }

  function handleToggleAllRulesCollapsed() {
    if (conditionRules.length === 0) return

    const nextCollapsed = !allRulesCollapsed
    setConditionRules((prev) =>
      prev.map((rule) => ({ ...rule, collapsed: nextCollapsed })),
    )
  }

  function handleReorderPointerDown(
    ruleId: string,
    event: ReactPointerEvent<HTMLElement>,
    cardElement: HTMLElement,
  ) {
    if (dragSessionRef.current) return

    const cardRect = cardElement.getBoundingClientRect()

    dragGhostRef.current?.remove()
    const ghost = cardElement.cloneNode(true) as HTMLElement
    ghost.setAttribute('aria-hidden', 'true')
    ghost.classList.add('sym-rule-card__drag-preview')
    ghost.classList.remove('sym-rule-card--dragging', 'sym-rule-card--drag-over')
    ghost.style.width = `${cardRect.width}px`
    document.body.appendChild(ghost)
    dragGhostRef.current = ghost

    dragSessionRef.current = {
      ruleId,
      originIndex: conditionRules.findIndex((rule) => rule.id === ruleId),
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
    }
    lastDragTargetRef.current = null

    updateDragGhostPosition(event.clientX, event.clientY)
    setDraggingRuleId(ruleId)
    setDragOverRuleId(null)
    document.body.classList.add('sym-rule-card-drag-active')

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  return (
    <>
      <div className="sym-page sym-rules-and-conditions">
        <article className="sym-card-primary sym-card-primary--section-sticky sym-no-hover">
          <header className="sym-card-header">
            <div className="sym-card-header__top">
              <h1 className="sym-card-title sym-card-title--contextual">
                <span className="sym-card-title__label">Rules and Conditions:</span>
                <span className="sym-card-title__value">{selectionRule.serviceSpecification}</span>
              </h1>
            </div>
            <div className="sym-card-header__bottom">
              <div className="sym-card-header__left">
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only"
                  aria-label="Back to Process Selection Rules"
                  onClick={() => navigate('/process-selection-rules')}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    arrow_back
                  </span>
                </button>
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only"
                  aria-label="Refresh"
                  onClick={handleRefresh}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    refresh
                  </span>
                </button>
                <button
                  type="button"
                  className="sym-btn-outlined-labeled"
                  onClick={handleCreateRule}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    add
                  </span>
                  Create Rule
                </button>
              </div>
              <div className="sym-card-header__right">
                <button
                  type="button"
                  className="sym-btn-filled-primary"
                  disabled={!canSave}
                  aria-disabled={!canSave}
                  onClick={handleSave}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    save
                  </span>
                  Save
                </button>
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only"
                  aria-label={allRulesCollapsed ? 'Expand all rules' : 'Collapse all rules'}
                  aria-expanded={!allRulesCollapsed}
                  disabled={conditionRules.length === 0}
                  aria-disabled={conditionRules.length === 0}
                  onClick={handleToggleAllRulesCollapsed}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    {allRulesCollapsed ? 'expand_more' : 'expand_less'}
                  </span>
                </button>
              </div>
            </div>
          </header>
        </article>

        {conditionRules.length === 0 ? (
          <article className="sym-card-primary sym-no-hover">
            <p className="sym-rules-and-conditions__empty" role="status">
              No rules created yet. Click &ldquo;+ Create Rule&rdquo; to add your first one.
            </p>
          </article>
        ) : (
          <div className="sym-rules-and-conditions__list" role="list">
            {conditionRules.map((rule, index) => (
              <RuleConditionCard
                key={rule.id}
                index={index + 1}
                rule={rule}
                isDragging={draggingRuleId === rule.id}
                isDragOver={dragOverRuleId === rule.id}
                onChange={(updater) => handleUpdateRule(rule.id, updater)}
                onDelete={() => handleDeleteRule(rule.id)}
                onReorderPointerDown={(event, cardElement) =>
                  handleReorderPointerDown(rule.id, event, cardElement)
                }
              />
            ))}
          </div>
        )}
      </div>
      <SymToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
