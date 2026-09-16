import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  INVENTORY_VALIDATION_FAIL_OPTIONS,
  PROCESS_SELECTION_ACTION_NAMES,
  PROCESS_SELECTION_SERVICE_SPECS,
  resolveActionTypeForName,
  type ProcessSelectionRule,
} from '../data/processSelectionRulesMockData'
import { SymIconTooltipButton } from './SymIconTooltipButton'

type EditProcessSelectionRuleDrawerProps = {
  rule: ProcessSelectionRule
  mode?: 'edit' | 'create'
  closeRequestRef?: React.RefObject<(() => void) | null>
  onSave: (next: ProcessSelectionRule) => void
  onClose: () => void
}

type DrawerMotionPhase = 'enter' | 'open' | 'exit'

const DRAWER_MOTION_MS = 180

const INTERACTIVE_OUTSIDE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'label',
  '[role="tab"]',
  '.sym-table__row--interactive',
  '.sym-table__sort',
].join(', ')

function isInteractiveOutsideTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest(INTERACTIVE_OUTSIDE_SELECTOR))
}

function rulesEqual(a: ProcessSelectionRule, b: ProcessSelectionRule): boolean {
  return (
    a.serviceSpecification === b.serviceSpecification &&
    a.actionType === b.actionType &&
    a.actionName === b.actionName &&
    a.description === b.description &&
    a.inventoryValidationFailAction === b.inventoryValidationFailAction
  )
}

function DrawerField({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="sym-detail-drawer__field">
      <label className="sym-detail-drawer__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="sym-detail-drawer__required" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  )
}

/** Non-blocking right drawer — Figma 2996:55274 (edit) + 2987:41749 (create). */
export function EditProcessSelectionRuleDrawer({
  rule,
  mode = 'edit',
  closeRequestRef,
  onSave,
  onClose,
}: EditProcessSelectionRuleDrawerProps) {
  const isCreateMode = mode === 'create'
  const formId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevEntityKeyRef = useRef(`${mode}:${rule.id}`)
  const [draft, setDraft] = useState(rule)
  const [motionPhase, setMotionPhase] = useState<DrawerMotionPhase>('enter')

  useEffect(() => {
    setDraft(rule)

    const entityKey = `${mode}:${rule.id}`
    if (prevEntityKeyRef.current !== entityKey) {
      prevEntityKeyRef.current = entityKey
      scrollRef.current?.scrollTo({ top: 0 })
    }
  }, [rule, mode])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMotionPhase('open'))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (motionPhase !== 'exit') return
    const timer = window.setTimeout(onClose, DRAWER_MOTION_MS)
    return () => window.clearTimeout(timer)
  }, [motionPhase, onClose])

  const handleClose = useCallback(() => {
    setMotionPhase('exit')
  }, [])

  useEffect(() => {
    if (!closeRequestRef) return
    closeRequestRef.current = handleClose
    return () => {
      closeRequestRef.current = null
    }
  }, [closeRequestRef, handleClose])

  useEffect(() => {
    if (motionPhase !== 'open') return

    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (target instanceof Element && target.closest('.sym-detail-drawer')) return
      if (isInteractiveOutsideTarget(target)) return
      handleClose()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [motionPhase, handleClose])

  const isDirty = useMemo(() => !rulesEqual(draft, rule), [draft, rule])
  const showFailOrderPanel = draft.actionType !== '' && draft.actionType !== 'ADD'
  const actionNameEnabled = isCreateMode && draft.serviceSpecification.length > 0

  const canSubmit = isCreateMode
    ? draft.serviceSpecification.length > 0 && draft.actionName.length > 0
    : isDirty

  function patch<K extends keyof ProcessSelectionRule>(key: K, value: ProcessSelectionRule[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleServiceSpecChange(serviceSpecification: string) {
    setDraft((prev) => ({
      ...prev,
      serviceSpecification,
      actionName: '',
      actionType: '',
    }))
  }

  function handleActionNameChange(actionName: string) {
    setDraft((prev) => ({
      ...prev,
      actionName,
      actionType: resolveActionTypeForName(actionName),
    }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    onSave(draft)
  }

  function handleCancel() {
    handleClose()
  }

  const inputClassName = 'form-control sym-form-control sym-detail-drawer__input'
  const readonlyClassName = `${inputClassName} sym-detail-drawer__input--readonly`

  return (
    <aside
      className={`sym-detail-drawer sym-detail-drawer--${motionPhase}`}
      aria-label={isCreateMode ? 'Create service specification' : 'Edit process selection rule'}
      data-testid={
        isCreateMode ? 'create-process-selection-rule-drawer' : 'edit-process-selection-rule-drawer'
      }
    >
      <form className="sym-detail-drawer__form sym-detail-drawer__panel-layout" onSubmit={handleSubmit}>
        <header className="sym-detail-drawer__header">
          <div className="sym-detail-drawer__title-row">
            <span className="material-icons-outlined sym-detail-drawer__title-icon" aria-hidden>
              {isCreateMode ? 'add' : 'edit'}
            </span>
            <h2 className="sym-detail-drawer__title">
              {isCreateMode ? 'Create Service Specification' : rule.serviceSpecification}
            </h2>
          </div>
          <div className="sym-detail-drawer__header-actions">
            <SymIconTooltipButton
              className="sym-icon-btn sym-icon-btn--primary-card"
              tooltip="Collapse drawer"
              aria-label="Collapse drawer"
              onClick={handleClose}
            >
              <span className="material-icons-outlined sym-detail-drawer__collapse-icon" aria-hidden>
                start
              </span>
            </SymIconTooltipButton>
            {!isCreateMode ? (
              <>
                <SymIconTooltipButton
                  className="sym-icon-btn sym-icon-btn--primary-card"
                  tooltip="Duplicate"
                  aria-label="Duplicate"
                >
                  <span className="material-icons-outlined" aria-hidden>
                    content_copy
                  </span>
                </SymIconTooltipButton>
                <SymIconTooltipButton
                  className="sym-icon-btn sym-icon-btn--primary-card"
                  tooltip="Open in new window"
                  aria-label="Open in new window"
                >
                  <span className="material-icons-outlined" aria-hidden>
                    open_in_new
                  </span>
                </SymIconTooltipButton>
              </>
            ) : null}
            <SymIconTooltipButton
              className="sym-icon-btn sym-icon-btn--primary-card"
              tooltip="Close drawer"
              aria-label="Close drawer"
              onClick={handleClose}
            >
              <span className="material-icons-outlined" aria-hidden>
                close
              </span>
            </SymIconTooltipButton>
          </div>
        </header>

        <div className="sym-detail-drawer__scroll" ref={scrollRef}>
          <div className="sym-detail-drawer__fields">
              <div className="sym-detail-drawer__input-group">
                <DrawerField id={`${formId}-service-spec`} label="Service Spec" required>
                  {isCreateMode ? (
                    <select
                      id={`${formId}-service-spec`}
                      className={`form-select ${inputClassName}`}
                      value={draft.serviceSpecification}
                      onChange={(event) => handleServiceSpecChange(event.target.value)}
                      required
                    >
                      <option value="">Please select</option>
                      {PROCESS_SELECTION_SERVICE_SPECS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      id={`${formId}-service-spec`}
                      className={`form-select ${readonlyClassName}`}
                      value={draft.serviceSpecification}
                      disabled
                      aria-readonly
                    >
                      {PROCESS_SELECTION_SERVICE_SPECS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </DrawerField>

                <div className="sym-detail-drawer__input-group--split">
                  <DrawerField id={`${formId}-action-name`} label="Action Name" required>
                    {isCreateMode ? (
                      <select
                        id={`${formId}-action-name`}
                        className={`form-select ${inputClassName}`}
                        value={draft.actionName}
                        onChange={(event) => handleActionNameChange(event.target.value)}
                        disabled={!actionNameEnabled}
                        required
                      >
                        <option value="">Please select</option>
                        {PROCESS_SELECTION_ACTION_NAMES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        id={`${formId}-action-name`}
                        className={`form-select ${readonlyClassName}`}
                        value={draft.actionName}
                        disabled
                        aria-readonly
                      >
                        {PROCESS_SELECTION_ACTION_NAMES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </DrawerField>

                  <DrawerField id={`${formId}-action-type`} label="Action Type">
                    <input
                      id={`${formId}-action-type`}
                      type="text"
                      className={readonlyClassName}
                      value={draft.actionType}
                      placeholder={isCreateMode ? 'Action Type' : undefined}
                      readOnly
                      disabled
                      aria-readonly
                    />
                  </DrawerField>
                </div>

                <DrawerField id={`${formId}-description`} label="Description">
                  <input
                    id={`${formId}-description`}
                    type="text"
                    className={inputClassName}
                    value={draft.description}
                    placeholder={isCreateMode ? 'Description' : undefined}
                    onChange={(event) => patch('description', event.target.value)}
                  />
                </DrawerField>
              </div>

              {showFailOrderPanel ? (
                <section className="sym-detail-drawer__highlight-panel" aria-label="Inventory validation">
                  <p className="sym-detail-drawer__highlight-panel-text">
                    Defines system behavior when a service fails inventory validation. (e.g., service
                    not found, invalid state for the requested action).
                  </p>
                  <DrawerField
                    id={`${formId}-inventory-validation`}
                    label="When inventory validation fails"
                    required
                  >
                    <select
                      id={`${formId}-inventory-validation`}
                      className={`form-select ${inputClassName}`}
                      value={draft.inventoryValidationFailAction}
                      onChange={(event) =>
                        patch('inventoryValidationFailAction', event.target.value)
                      }
                      required
                    >
                      {INVENTORY_VALIDATION_FAIL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </DrawerField>
                </section>
              ) : null}
          </div>

          <footer className="sym-detail-drawer__footer">
            <button
              type="submit"
              className="sym-btn-filled-primary"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              {isCreateMode ? 'Save Service Spec' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="sym-btn-outlined-labeled"
              onClick={isCreateMode ? handleCancel : handleClose}
            >
              {isCreateMode ? 'Cancel' : 'Close'}
            </button>
          </footer>
        </div>
      </form>
    </aside>
  )
}
