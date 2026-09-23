import { useEffect, useId, useMemo, useState } from 'react'
import { SymIconTooltipButton } from './SymIconTooltipButton'
import {
  CHARACTERISTIC_VALUE_RANGE_INTERVALS,
  type CharacteristicValue,
  type CharacteristicValueRangeInterval,
} from '../data/serviceDomainMockData'

type ValuesTab = 'list' | 'add' | 'edit'

type CharacteristicValueDraft = Omit<CharacteristicValue, 'id'>

type CharacteristicValuesPanelProps = {
  characteristicId: string
  values: CharacteristicValue[]
  highlightedValueId: string | null
  onAddValue: (value: CharacteristicValueDraft) => void
  onUpdateValue: (valueId: string, value: CharacteristicValueDraft) => void
  onSetDefaultValue: (valueId: string, isDefault: boolean) => void
  onClearValueHighlight: () => void
  closeExitsDrawer?: boolean
  onBack: () => void
  onDrawerClose: () => void
}

const EMPTY_DRAFT: CharacteristicValueDraft = {
  value: '',
  unitOfMeasure: '',
  description: '',
  validForStart: '',
  validForEnd: '',
  valueFrom: '',
  valueTo: '',
  regex: '',
  rangeInterval: '',
  isDefault: false,
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

function parseDisplayDate(display: string): string {
  if (!display) return ''
  const parts = display.split('/')
  if (parts.length !== 3) return display
  const [day, month, year] = parts
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function valueToDraft(row: CharacteristicValue): CharacteristicValueDraft {
  return {
    value: row.value,
    unitOfMeasure: row.unitOfMeasure,
    description: row.description,
    validForStart: parseDisplayDate(row.validForStart),
    validForEnd: parseDisplayDate(row.validForEnd),
    valueFrom: row.valueFrom,
    valueTo: row.valueTo,
    regex: row.regex,
    rangeInterval: row.rangeInterval,
    isDefault: row.isDefault,
  }
}

function draftsEqual(a: CharacteristicValueDraft, b: CharacteristicValueDraft): boolean {
  return (
    a.value === b.value &&
    a.unitOfMeasure === b.unitOfMeasure &&
    a.description === b.description &&
    a.validForStart === b.validForStart &&
    a.validForEnd === b.validForEnd &&
    a.valueFrom === b.valueFrom &&
    a.valueTo === b.valueTo &&
    a.regex === b.regex &&
    a.rangeInterval === b.rangeInterval &&
    a.isDefault === b.isDefault
  )
}

function draftToPayload(draft: CharacteristicValueDraft): CharacteristicValueDraft {
  return {
    value: draft.value.trim(),
    unitOfMeasure: draft.unitOfMeasure.trim(),
    description: draft.description.trim(),
    validForStart: formatDisplayDate(draft.validForStart),
    validForEnd: draft.validForEnd ? formatDisplayDate(draft.validForEnd) : '',
    valueFrom: draft.valueFrom.trim(),
    valueTo: draft.valueTo.trim(),
    regex: draft.regex.trim(),
    rangeInterval: draft.rangeInterval,
    isDefault: draft.isDefault,
  }
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

function ValueFormFields({
  formId,
  draft,
  inputClassName,
  onPatch,
}: {
  formId: string
  draft: CharacteristicValueDraft
  inputClassName: string
  onPatch: <K extends keyof CharacteristicValueDraft>(
    key: K,
    value: CharacteristicValueDraft[K],
  ) => void
}) {
  return (
    <div className="sym-detail-drawer__fields">
      <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
        <DrawerField id={`${formId}-value`} label="Value">
          <input
            id={`${formId}-value`}
            type="text"
            className={inputClassName}
            placeholder="Value"
            value={draft.value}
            onChange={(e) => onPatch('value', e.target.value)}
          />
        </DrawerField>
        <DrawerField id={`${formId}-unit`} label="Unit of Measure">
          <input
            id={`${formId}-unit`}
            type="text"
            className={inputClassName}
            placeholder="inch, mm, etc"
            value={draft.unitOfMeasure}
            onChange={(e) => onPatch('unitOfMeasure', e.target.value)}
          />
        </DrawerField>
      </div>

      <DrawerField id={`${formId}-description`} label="Description">
        <input
          id={`${formId}-description`}
          type="text"
          className={inputClassName}
          placeholder="Description value"
          value={draft.description}
          onChange={(e) => onPatch('description', e.target.value)}
        />
      </DrawerField>

      <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
        <DrawerField id={`${formId}-value-from`} label="Value From">
          <input
            id={`${formId}-value-from`}
            type="text"
            className={inputClassName}
            placeholder="Enter value"
            value={draft.valueFrom}
            onChange={(e) => onPatch('valueFrom', e.target.value)}
          />
        </DrawerField>
        <DrawerField id={`${formId}-value-to`} label="Value To">
          <input
            id={`${formId}-value-to`}
            type="text"
            className={inputClassName}
            placeholder="Enter value"
            value={draft.valueTo}
            onChange={(e) => onPatch('valueTo', e.target.value)}
          />
        </DrawerField>
      </div>

      <div className="sym-detail-drawer__input-group sym-detail-drawer__input-group--split">
        <DrawerField id={`${formId}-valid-for-start`} label="Valid For Start" required>
          <input
            id={`${formId}-valid-for-start`}
            type="date"
            className={inputClassName}
            value={draft.validForStart}
            onChange={(e) => onPatch('validForStart', e.target.value)}
            required
          />
        </DrawerField>
        <DrawerField id={`${formId}-valid-for-end`} label="Valid For End">
          <input
            id={`${formId}-valid-for-end`}
            type="date"
            className={inputClassName}
            value={draft.validForEnd}
            onChange={(e) => onPatch('validForEnd', e.target.value)}
          />
        </DrawerField>
      </div>

      <DrawerField id={`${formId}-regex`} label="Regex">
        <input
          id={`${formId}-regex`}
          type="text"
          className={inputClassName}
          placeholder="Enter regex"
          value={draft.regex}
          onChange={(e) => onPatch('regex', e.target.value)}
        />
      </DrawerField>

      <DrawerField id={`${formId}-range-interval`} label="Range Interval">
        <select
          id={`${formId}-range-interval`}
          className="form-select sym-form-control sym-detail-drawer__input"
          value={draft.rangeInterval}
          onChange={(e) =>
            onPatch('rangeInterval', e.target.value as CharacteristicValueRangeInterval | '')
          }
        >
          <option value="">Please select</option>
          {CHARACTERISTIC_VALUE_RANGE_INTERVALS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </DrawerField>
    </div>
  )
}

/** Values sub-panel — Figma 976:47888 (list) + 980:49053 (Add) + Edit Value tab. */
export function CharacteristicValuesPanel({
  characteristicId,
  values,
  highlightedValueId,
  onAddValue,
  onUpdateValue,
  onSetDefaultValue,
  onClearValueHighlight,
  closeExitsDrawer = false,
  onBack,
  onDrawerClose,
}: CharacteristicValuesPanelProps) {
  const formId = useId()
  const [activeTab, setActiveTab] = useState<ValuesTab>('list')
  const [editingValueId, setEditingValueId] = useState<string | null>(null)
  const [draft, setDraft] = useState<CharacteristicValueDraft>(EMPTY_DRAFT)
  const [editBaseline, setEditBaseline] = useState<CharacteristicValueDraft | null>(null)

  useEffect(() => {
    setActiveTab('list')
    setEditingValueId(null)
    setDraft(EMPTY_DRAFT)
    setEditBaseline(null)
  }, [characteristicId])

  const inputClassName = 'form-control sym-form-control sym-detail-drawer__input'

  const canSubmitAdd = draft.validForStart.length > 0

  const canSubmitEdit = useMemo(() => {
    if (!editBaseline || !draft.validForStart) return false
    return !draftsEqual(draft, editBaseline)
  }, [draft, editBaseline])

  function patch<K extends keyof CharacteristicValueDraft>(
    key: K,
    value: CharacteristicValueDraft[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function openAddTab() {
    setEditingValueId(null)
    setEditBaseline(null)
    setDraft(EMPTY_DRAFT)
    setActiveTab('add')
  }

  function openListTab() {
    setEditingValueId(null)
    setEditBaseline(null)
    setDraft(EMPTY_DRAFT)
    setActiveTab('list')
  }

  function handleStartEdit(row: CharacteristicValue) {
    if (highlightedValueId && row.id !== highlightedValueId) {
      onClearValueHighlight()
    }
    const nextDraft = valueToDraft(row)
    setEditingValueId(row.id)
    setEditBaseline(nextDraft)
    setDraft(nextDraft)
    setActiveTab('edit')
  }

  function handleValueRowClick(rowId: string) {
    if (highlightedValueId && rowId !== highlightedValueId) {
      onClearValueHighlight()
    }
  }

  function handleCancelForm() {
    openListTab()
  }

  function handleSubmitAdd(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmitAdd) return
    onAddValue({ ...draftToPayload(draft), isDefault: false })
    openListTab()
  }

  function handleSubmitEdit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmitEdit || !editingValueId) return
    onUpdateValue(editingValueId, draftToPayload(draft))
    openListTab()
  }

  function handleLeaveValues() {
    if (closeExitsDrawer) {
      onDrawerClose()
    } else {
      onBack()
    }
  }

  return (
    <div className="sym-detail-drawer__panel-layout">
      <header className="sym-detail-drawer__header">
        <div className="sym-detail-drawer__title-row">
          <span className="material-icons-outlined sym-detail-drawer__title-icon" aria-hidden>
            code
          </span>
          <h2 className="sym-detail-drawer__title">Values</h2>
        </div>
        <div className="sym-detail-drawer__header-actions">
          <button
            type="button"
            className="sym-icon-btn sym-icon-btn--primary"
            aria-label={closeExitsDrawer ? 'Close drawer' : 'Back to edit characteristic'}
            onClick={handleLeaveValues}
          >
            <span className="material-icons-outlined sym-detail-drawer__collapse-icon" aria-hidden>
              start
            </span>
          </button>
          <button
            type="button"
            className="sym-icon-btn sym-icon-btn--primary"
            aria-label="Close drawer"
            onClick={onDrawerClose}
          >
            <span className="material-icons-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>
      </header>

      <div className="sym-detail-drawer__scroll">
        <div className="sym-detail-drawer__values-content">
            <ul className="nav nav-tabs sym-nav-tabs-top" role="tablist" aria-label="Values tabs">
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${activeTab === 'list' ? ' active' : ''}`}
                  aria-selected={activeTab === 'list'}
                  id={`${formId}-values-tab-list`}
                  aria-controls={`${formId}-values-panel-list`}
                  onClick={openListTab}
                >
                  Values
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${activeTab === 'add' ? ' active' : ''}`}
                  aria-selected={activeTab === 'add'}
                  id={`${formId}-values-tab-add`}
                  aria-controls={`${formId}-values-panel-add`}
                  onClick={openAddTab}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    add
                  </span>
                  Add Value
                </button>
              </li>
              {editingValueId ? (
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    className={`nav-link${activeTab === 'edit' ? ' active' : ''}`}
                    aria-selected={activeTab === 'edit'}
                    id={`${formId}-values-tab-edit`}
                    aria-controls={`${formId}-values-panel-edit`}
                    onClick={() => setActiveTab('edit')}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      edit
                    </span>
                    Edit Value
                  </button>
                </li>
              ) : null}
            </ul>

            {activeTab === 'list' ? (
              <div
                id={`${formId}-values-panel-list`}
                role="tabpanel"
                aria-labelledby={`${formId}-values-tab-list`}
              >
                {values.length > 0 ? (
                  <table className="sym-secondary-table" aria-label="Characteristic values">
                    <colgroup>
                      <col />
                      <col />
                      <col />
                      <col className="sym-secondary-table__col--narrow" />
                      <col className="sym-secondary-table__col--narrow" />
                      <col className="sym-secondary-table__col--default" />
                      <col className="sym-secondary-table__col--actions" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col">Value</th>
                        <th scope="col">U. Of Measure</th>
                        <th scope="col">Valid For Start</th>
                        <th scope="col">Value From</th>
                        <th scope="col">Value To</th>
                        <th scope="col">Default</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.map((row, index) => {
                        const rowClass = [
                          index === values.length - 1 ? 'sym-secondary-table__row--last' : '',
                          row.id === highlightedValueId ? 'sym-table__row--new' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')

                        return (
                          <tr
                            key={row.id}
                            className={rowClass || undefined}
                            onClick={() => handleValueRowClick(row.id)}
                          >
                            <td>{row.value}</td>
                            <td>{row.unitOfMeasure}</td>
                            <td>{row.validForStart}</td>
                            <td>{row.valueFrom || '\u00A0'}</td>
                            <td>{row.valueTo || '\u00A0'}</td>
                            <td
                              className="sym-secondary-table__cell--checkbox"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="form-check sym-secondary-table__checkbox">
                                <input
                                  className="form-check-input sym-secondary-table__checkbox-input"
                                  type="checkbox"
                                  id={`value-default-${row.id}`}
                                  checked={row.isDefault}
                                  onChange={(e) => onSetDefaultValue(row.id, e.target.checked)}
                                  aria-label={`Default for ${row.value}`}
                                />
                              </div>
                            </td>
                            <td className="sym-secondary-table__cell--actions">
                              <div className="sym-table-actions sym-secondary-table__actions">
                                <SymIconTooltipButton
                                  className="sym-icon-btn sym-icon-btn--primary sym-secondary-table__icon-btn"
                                  tooltip="Edit"
                                  aria-label="Edit"
                                  onClick={() => handleStartEdit(row)}
                                >
                                  <span className="material-icons-outlined" aria-hidden>
                                    edit
                                  </span>
                                </SymIconTooltipButton>
                                <SymIconTooltipButton
                                  className="sym-icon-btn sym-icon-btn--danger sym-secondary-table__icon-btn"
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
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="sym-detail-drawer__values-empty" role="status">
                    No values added yet. Go to the &ldquo;Add Value&rdquo; tab to create one.
                  </p>
                )}
              </div>
            ) : activeTab === 'add' ? (
              <form
                id={`${formId}-values-panel-add`}
                role="tabpanel"
                aria-labelledby={`${formId}-values-tab-add`}
                className="sym-detail-drawer__values-add-form"
                onSubmit={handleSubmitAdd}
              >
                <ValueFormFields
                  formId={`${formId}-add`}
                  draft={draft}
                  inputClassName={inputClassName}
                  onPatch={patch}
                />
              </form>
            ) : (
              <form
                id={`${formId}-values-panel-edit`}
                role="tabpanel"
                aria-labelledby={`${formId}-values-tab-edit`}
                className="sym-detail-drawer__values-add-form"
                onSubmit={handleSubmitEdit}
              >
                <ValueFormFields
                  formId={`${formId}-edit`}
                  draft={draft}
                  inputClassName={inputClassName}
                  onPatch={patch}
                />
              </form>
            )}
        </div>

        <footer className="sym-detail-drawer__footer">
          {activeTab === 'list' ? (
            <button type="button" className="sym-btn-outlined-labeled" onClick={handleLeaveValues}>
              Close
            </button>
          ) : (
            <>
              <button
                type="submit"
                form={
                  activeTab === 'add'
                    ? `${formId}-values-panel-add`
                    : `${formId}-values-panel-edit`
                }
                className="sym-btn-filled-primary"
                disabled={activeTab === 'add' ? !canSubmitAdd : !canSubmitEdit}
                aria-disabled={activeTab === 'add' ? !canSubmitAdd : !canSubmitEdit}
              >
                {activeTab === 'add' ? 'Save Value' : 'Save Changes'}
              </button>
              <button type="button" className="sym-btn-outlined-labeled" onClick={handleCancelForm}>
                Cancel
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
