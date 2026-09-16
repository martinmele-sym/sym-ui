import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { CharacteristicValuesPanel } from './CharacteristicValuesPanel'
import {
  CHARACTERISTIC_VALUES_BY_ID,
  SERVICE_SPEC_VALUE_TYPES,
  type CharacteristicValue,
  type ServiceSpecCharacteristic,
} from '../data/serviceDomainMockData'

type DrawerPanel = 'edit' | 'values'

type EditCharacteristicDrawerProps = {
  characteristic: ServiceSpecCharacteristic
  mode?: 'edit' | 'add'
  initialPanel?: DrawerPanel
  valuesExitClosesDrawer?: boolean
  closeRequestRef?: React.RefObject<(() => void) | null>
  onSave: (next: ServiceSpecCharacteristic) => void
  onClose: () => void
}

type DrawerMotionPhase = 'enter' | 'open' | 'exit'
type PanelSlide = 'idle' | 'to-values' | 'to-edit'

const DRAWER_MOTION_MS = 180
const PANEL_SLIDE_MS = 280

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

function characteristicsEqual(a: ServiceSpecCharacteristic, b: ServiceSpecCharacteristic): boolean {
  return (
    a.name === b.name &&
    a.description === b.description &&
    a.valueType === b.valueType &&
    a.configurable === b.configurable &&
    a.mutable === b.mutable &&
    a.unique === b.unique &&
    a.subCharacteristics === b.subCharacteristics &&
    a.minCardinality === b.minCardinality &&
    a.maxCardinality === b.maxCardinality &&
    a.validFrom === b.validFrom &&
    a.validTo === b.validTo
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

/** Non-blocking right drawer — Figma 973:47114 (Edit) + 976:47872 (Values). */
export function EditCharacteristicDrawer({
  characteristic,
  mode = 'edit',
  initialPanel = 'edit',
  valuesExitClosesDrawer = false,
  closeRequestRef,
  onSave,
  onClose,
}: EditCharacteristicDrawerProps) {
  const isAddMode = mode === 'add'
  const formId = useId()
  const prevCharacteristicIdRef = useRef(characteristic.id)
  const [draft, setDraft] = useState(characteristic)
  const [motionPhase, setMotionPhase] = useState<DrawerMotionPhase>('enter')
  const [activePanel, setActivePanel] = useState<DrawerPanel>(initialPanel)
  const [panelSlide, setPanelSlide] = useState<PanelSlide>('idle')

  const [values, setValues] = useState<CharacteristicValue[]>(
    () => CHARACTERISTIC_VALUES_BY_ID[characteristic.id] ?? [],
  )
  const [highlightedValueId, setHighlightedValueId] = useState<string | null>(null)

  useEffect(() => {
    setDraft(characteristic)
    setValues(CHARACTERISTIC_VALUES_BY_ID[characteristic.id] ?? [])
    setHighlightedValueId(null)

    const sameCharacteristic = prevCharacteristicIdRef.current === characteristic.id
    prevCharacteristicIdRef.current = characteristic.id

    setActivePanel((currentPanel) => {
      if (initialPanel === 'values') {
        if (sameCharacteristic && currentPanel === 'edit') {
          setPanelSlide('to-values')
          return currentPanel
        }
        setPanelSlide('idle')
        return 'values'
      }

      if (sameCharacteristic && currentPanel === 'values') {
        setPanelSlide('to-edit')
        return currentPanel
      }
      setPanelSlide('idle')
      return 'edit'
    })
  }, [characteristic, initialPanel])

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

  useEffect(() => {
    if (panelSlide === 'idle') return
    const timer = window.setTimeout(() => {
      setActivePanel(panelSlide === 'to-values' ? 'values' : 'edit')
      setPanelSlide('idle')
    }, PANEL_SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [panelSlide])

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

  const navigateToValues = useCallback(() => {
    if (activePanel === 'values' || panelSlide !== 'idle') return
    setPanelSlide('to-values')
  }, [activePanel, panelSlide])

  const navigateToEdit = useCallback(() => {
    if (activePanel === 'edit' || panelSlide !== 'idle') return
    setPanelSlide('to-edit')
  }, [activePanel, panelSlide])

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

  const isDirty = useMemo(
    () => !characteristicsEqual(draft, characteristic),
    [draft, characteristic],
  )

  const canSubmit = isAddMode
    ? draft.name.trim().length > 0 && draft.validFrom.length > 0
    : isDirty

  function patch<K extends keyof ServiceSpecCharacteristic>(
    key: K,
    value: ServiceSpecCharacteristic[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleCancel() {
    handleClose()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    onSave(draft)
  }

  function handleAddValue(value: Omit<CharacteristicValue, 'id'>) {
    const id = `${characteristic.id}-v${Date.now()}`
    setValues((prev) => [{ ...value, id }, ...prev])
    setHighlightedValueId(id)
  }

  function handleSetDefaultValue(valueId: string, isDefault: boolean) {
    setValues((prev) =>
      prev.map((row) => {
        if (isDefault) return { ...row, isDefault: row.id === valueId }
        if (row.id === valueId) return { ...row, isDefault: false }
        return row
      }),
    )
  }

  function handleUpdateValue(valueId: string, value: Omit<CharacteristicValue, 'id'>) {
    setValues((prev) =>
      prev.map((row) => (row.id === valueId ? { ...value, id: valueId } : row)),
    )
    setHighlightedValueId(valueId)
  }

  const inputClassName = 'form-control sym-form-control sym-detail-drawer__input'

  const panelViewportClass =
    panelSlide !== 'idle'
      ? `sym-detail-drawer__panel-viewport--${panelSlide}`
      : `sym-detail-drawer__panel-viewport--${activePanel}`

  return (
    <aside
      className={`sym-detail-drawer sym-detail-drawer--${motionPhase}`}
      aria-label={
        activePanel === 'values'
          ? 'Characteristic values'
          : isAddMode
            ? 'Add characteristic'
            : 'Edit characteristic'
      }
      data-testid="edit-characteristic-drawer"
    >
      <div className="sym-detail-drawer__form">
        <div className={`sym-detail-drawer__panel-viewport ${panelViewportClass}`}>
          <div className="sym-detail-drawer__panel sym-detail-drawer__panel--edit">
            <form className="sym-detail-drawer__panel-layout" onSubmit={handleSubmit}>
              <header className="sym-detail-drawer__header">
                <div className="sym-detail-drawer__title-row">
                  <span className="material-icons-outlined sym-detail-drawer__title-icon" aria-hidden>
                    {isAddMode ? 'add' : 'edit'}
                  </span>
                  <h2 className="sym-detail-drawer__title">
                    {isAddMode ? 'Add Characteristic' : 'Edit Characteristic'}
                  </h2>
                  {!isAddMode ? (
                    <button
                      type="button"
                      className="sym-btn-outlined-labeled sym-btn--sm"
                      onClick={navigateToValues}
                    >
                      <span className="material-icons-outlined" aria-hidden>
                        code
                      </span>
                      Values
                    </button>
                  ) : null}
                </div>
                <div className="sym-detail-drawer__header-actions">
                  <button
                    type="button"
                    className="sym-icon-btn sym-icon-btn--primary"
                    aria-label="Collapse drawer"
                    onClick={handleClose}
                  >
                    <span
                      className="material-icons-outlined sym-detail-drawer__collapse-icon"
                      aria-hidden
                    >
                      start
                    </span>
                  </button>
                  <button
                    type="button"
                    className="sym-icon-btn sym-icon-btn--primary"
                    aria-label="Close drawer"
                    onClick={handleClose}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      close
                    </span>
                  </button>
                </div>
              </header>

              <div className="sym-detail-drawer__scroll">
                <div className="sym-detail-drawer__fields">
                  <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
                    <DrawerField id={`${formId}-name`} label="Name" required>
                      <input
                        id={`${formId}-name`}
                        type="text"
                        className={inputClassName}
                        value={draft.name}
                        onChange={(e) => patch('name', e.target.value)}
                        required
                      />
                    </DrawerField>
                    <DrawerField id={`${formId}-description`} label="Description">
                      <input
                        id={`${formId}-description`}
                        type="text"
                        className={inputClassName}
                        value={draft.description}
                        onChange={(e) => patch('description', e.target.value)}
                      />
                    </DrawerField>
                  </div>

                  <DrawerField id={`${formId}-value-type`} label="Value Type" required>
                    <select
                      id={`${formId}-value-type`}
                      className="form-select sym-form-control sym-detail-drawer__input"
                      value={draft.valueType}
                      onChange={(e) =>
                        patch('valueType', e.target.value as ServiceSpecCharacteristic['valueType'])
                      }
                      required
                    >
                      {SERVICE_SPEC_VALUE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </DrawerField>

                  <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
                    <DrawerField id={`${formId}-min-cardinality`} label="Min Cardinality">
                      <input
                        id={`${formId}-min-cardinality`}
                        type="number"
                        min={0}
                        className={inputClassName}
                        value={draft.minCardinality}
                        onChange={(e) => patch('minCardinality', Number(e.target.value))}
                      />
                    </DrawerField>
                    <DrawerField id={`${formId}-max-cardinality`} label="Max Cardinality">
                      <input
                        id={`${formId}-max-cardinality`}
                        type="number"
                        min={0}
                        className={inputClassName}
                        value={draft.maxCardinality}
                        onChange={(e) => patch('maxCardinality', Number(e.target.value))}
                      />
                    </DrawerField>
                  </div>

                  <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
                    <DrawerField id={`${formId}-valid-from`} label="Valid from" required>
                      <input
                        id={`${formId}-valid-from`}
                        type="date"
                        className={inputClassName}
                        value={draft.validFrom}
                        onChange={(e) => patch('validFrom', e.target.value)}
                        required
                      />
                    </DrawerField>
                    <DrawerField id={`${formId}-valid-to`} label="Valid to">
                      <input
                        id={`${formId}-valid-to`}
                        type="date"
                        className={inputClassName}
                        value={draft.validTo}
                        onChange={(e) => patch('validTo', e.target.value)}
                      />
                    </DrawerField>
                  </div>

                  <div className="sym-detail-drawer__checkbox-group" role="group" aria-label="Flags">
                    {(
                      [
                        ['configurable', 'Configurable'],
                        ['mutable', 'Mutable'],
                        ['unique', 'Unique'],
                        ['subCharacteristics', 'SubCharacteristics'],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="form-check sym-detail-drawer__checkbox">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`${formId}-${key}`}
                          checked={draft[key]}
                          onChange={(e) => patch(key, e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor={`${formId}-${key}`}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <section
                    className="sym-detail-drawer__relationships"
                    aria-label="Characteristics relationships"
                  >
                    <div className="sym-detail-drawer__relationships-header">
                      <h3 className="sym-detail-drawer__relationships-title">
                        Characteristics Relationships
                      </h3>
                      <button type="button" className="sym-btn-outlined-labeled sym-btn--sm">
                        <span className="material-icons-outlined" aria-hidden>
                          add
                        </span>
                        Add Relationship
                      </button>
                    </div>
                    <p className="sym-detail-drawer__relationships-hint">
                      Use the &quot;Add Relationship&quot; button to link characteristics relationships.
                    </p>
                  </section>
                </div>

                <footer className="sym-detail-drawer__footer">
                  <button
                    type="submit"
                    className="sym-btn-filled-primary"
                    disabled={!canSubmit}
                    aria-disabled={!canSubmit}
                  >
                    {isAddMode ? 'Save Characteristic' : 'Save Changes'}
                  </button>
                  <button type="button" className="sym-btn-outlined-labeled" onClick={handleCancel}>
                    Cancel
                  </button>
                </footer>
              </div>
            </form>
          </div>

          <div className="sym-detail-drawer__panel sym-detail-drawer__panel--values">
            <CharacteristicValuesPanel
              characteristicId={characteristic.id}
              values={values}
              highlightedValueId={highlightedValueId}
              closeExitsDrawer={valuesExitClosesDrawer}
              onAddValue={handleAddValue}
              onUpdateValue={handleUpdateValue}
              onSetDefaultValue={handleSetDefaultValue}
              onClearValueHighlight={() => setHighlightedValueId(null)}
              onBack={navigateToEdit}
              onDrawerClose={handleClose}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
