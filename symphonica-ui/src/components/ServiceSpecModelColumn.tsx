import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { OrderType } from '../data/orderTypes'
import type { ServiceSpecModel } from '../data/serviceSpecMockData'
import { readFileAsDataUrl } from '../utils/serviceSpecAttachment'
import { ServiceSpecCascadeItem } from './ServiceSpecCascadeItem'
import { SymImagePreviewModal } from './SymImagePreviewModal'
import { SymOrderTypesMultiselect } from './SymOrderTypesMultiselect'

export type ModelFormDraft = {
  name: string
  description: string
  orderTypes: OrderType[]
  imageFile: File | null
  imagePreviewUrl: string | null
  imageName: string | null
}

type ModelFormMode = { kind: 'add' } | { kind: 'edit'; modelId: string }

const emptyDraft = (): ModelFormDraft => ({
  name: '',
  description: '',
  orderTypes: [],
  imageFile: null,
  imagePreviewUrl: null,
  imageName: null,
})

function draftFromModel(model: ServiceSpecModel): ModelFormDraft {
  return {
    name: model.name,
    description: model.description ?? '',
    orderTypes: model.orderTypes ?? [],
    imageFile: null,
    imagePreviewUrl: model.imageUrl ?? null,
    imageName: model.imageName ?? null,
  }
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ServiceSpecModelColumnProps = {
  vendorId: string
  vendorName?: string
  models: ServiceSpecModel[]
  selectedId: string | null
  onSelect: (id: string) => void
  onSave: (model: ServiceSpecModel, mode: 'add' | 'edit') => void
  onDelete: (id: string) => void
}

export function ServiceSpecModelColumn({
  vendorId,
  vendorName,
  models,
  selectedId,
  onSelect,
  onSave,
  onDelete,
}: ServiceSpecModelColumnProps) {
  const searchId = useId()
  const nameId = useId()
  const descriptionId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [formMode, setFormMode] = useState<ModelFormMode | null>(null)
  const [draft, setDraft] = useState<ModelFormDraft>(emptyDraft)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [listImagePreview, setListImagePreview] = useState<{ url: string; alt: string } | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return models
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q) ||
        (m.orderTypes ?? []).some((ot) => ot.toLowerCase().includes(q)),
    )
  }, [models, query])

  useEffect(() => {
    return () => {
      if (draft.imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(draft.imagePreviewUrl)
      }
    }
  }, [draft.imagePreviewUrl])

  function openAddForm() {
    setFormMode({ kind: 'add' })
    setDraft(emptyDraft())
  }

  function openEditForm(model: ServiceSpecModel) {
    setFormMode({ kind: 'edit', modelId: model.id })
    setDraft(draftFromModel(model))
  }

  function closeForm() {
    if (draft.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.imagePreviewUrl)
    }
    setImagePreviewOpen(false)
    setFormMode(null)
    setDraft(emptyDraft())
  }

  function handleImagePick(file: File | undefined) {
    if (!file) return
    if (draft.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.imagePreviewUrl)
    }
    const previewUrl = URL.createObjectURL(file)
    setDraft((prev) => ({
      ...prev,
      imageFile: file,
      imagePreviewUrl: previewUrl,
      imageName: file.name,
    }))
  }

  function removeImage() {
    if (draft.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.imagePreviewUrl)
    }
    setImagePreviewOpen(false)
    setDraft((prev) => ({
      ...prev,
      imageFile: null,
      imagePreviewUrl: null,
      imageName: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    const name = draft.name.trim()
    if (!name) return

    const description = draft.description.trim()
    let imageUrl = draft.imagePreviewUrl ?? undefined
    const imageName = draft.imageName ?? undefined
    const orderTypes = draft.orderTypes
    if (draft.imageFile) {
      imageUrl = await readFileAsDataUrl(draft.imageFile)
    }

    if (formMode?.kind === 'edit') {
      const existing = models.find((m) => m.id === formMode.modelId)
      if (!existing) return
      onSave(
        {
          ...existing,
          name,
          description: description || undefined,
          orderTypes,
          imageUrl,
          imageName,
        },
        'edit',
      )
    } else {
      const baseId = slugify(name) || 'model'
      let id = baseId
      let n = 1
      while (models.some((m) => m.id === id)) {
        id = `${baseId}-${n}`
        n += 1
      }
      onSave(
        {
          id,
          vendorId,
          name,
          description: description || undefined,
          orderTypes,
          imageUrl,
          imageName,
        },
        'add',
      )
    }

    closeForm()
  }

  const formOpen = formMode !== null
  const canSave = draft.name.trim().length > 0

  return (
    <article className="sym-card-primary sym-service-spec-column sym-no-hover">
      <header className="sym-service-spec-column__header">
        <h2 className="sym-service-spec-column__title">Model</h2>
        {!formOpen ? (
          <button
            type="button"
            className="sym-btn-outlined-labeled sym-btn--sm"
            onClick={openAddForm}
            disabled={!vendorId}
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Model
          </button>
        ) : (
          <button
            type="button"
            className="sym-btn-outlined-labeled sym-btn--sm sym-service-spec-vendor-form__header-add"
            aria-label="Add model form open"
            aria-pressed
            disabled
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Model
          </button>
        )}
      </header>

      {!formOpen ? (
        <div className="sym-service-spec-column__search-wrap">
          <label className="visually-hidden" htmlFor={searchId}>
            Search model
          </label>
          <input
            id={searchId}
            type="search"
            className="form-control sym-form-control sym-service-spec-column__search"
            placeholder="Search model"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <span className="material-icons-outlined sym-service-spec-column__search-icon" aria-hidden>
            search
          </span>
        </div>
      ) : null}

      {formOpen ? (
        <div
          className="sym-service-spec-vendor-form sym-service-spec-model-form"
          aria-label={formMode?.kind === 'edit' ? 'Edit model' : `Add model${vendorName ? ` for ${vendorName}` : ''}`}
        >
          <div className="sym-service-spec-vendor-form__fields">
            <div className="sym-service-spec-vendor-form__field">
              <label className="sym-service-spec-vendor-form__label" htmlFor={nameId}>
                Name
                <span className="sym-service-spec-vendor-form__required" aria-hidden>
                  *
                </span>
              </label>
              <input
                id={nameId}
                type="text"
                className="form-control sym-form-control sym-service-spec-vendor-form__input"
                placeholder="Model name"
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                autoComplete="off"
                required
              />
            </div>

            <div className="sym-service-spec-vendor-form__field">
              <label className="sym-service-spec-vendor-form__label" htmlFor={descriptionId}>
                Description
              </label>
              <input
                id={descriptionId}
                type="text"
                className="form-control sym-form-control sym-service-spec-vendor-form__input"
                placeholder="Description"
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                autoComplete="off"
              />
            </div>

            <div className="sym-service-spec-vendor-form__field sym-service-spec-model-form__multiselect-field">
              <SymOrderTypesMultiselect
                value={draft.orderTypes}
                onChange={(orderTypes) => setDraft((prev) => ({ ...prev, orderTypes }))}
              />
            </div>
          </div>

          <div className="sym-service-spec-vendor-form__upload-row">
            <div
              className={`sym-service-spec-vendor-form__upload-card${
                draft.imagePreviewUrl ? ' sym-service-spec-vendor-form__upload-card--filled' : ''
              }`}
            >
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                className="visually-hidden"
                accept="image/*"
                onChange={(e) => handleImagePick(e.target.files?.[0])}
              />
              {draft.imagePreviewUrl ? (
                <button
                  type="button"
                  className="sym-service-spec-vendor-form__preview-btn"
                  aria-label={`View ${draft.imageName ?? 'model image'} in full size`}
                  onClick={() => setImagePreviewOpen(true)}
                >
                  <img
                    src={draft.imagePreviewUrl}
                    alt=""
                    className="sym-service-spec-vendor-form__preview-img"
                    aria-hidden
                  />
                  <span className="sym-service-spec-vendor-form__preview-overlay" aria-hidden>
                    <span className="material-icons-outlined sym-service-spec-vendor-form__preview-icon">
                      zoom_in
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only sym-service-spec-vendor-form__upload-btn"
                  aria-label="Upload model image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    photo_camera
                  </span>
                </button>
              )}
            </div>
            <div className="sym-service-spec-vendor-form__upload-meta">
              {draft.imagePreviewUrl ? (
                <>
                  <span
                    className="sym-service-spec-vendor-form__upload-label sym-service-spec-vendor-form__filename"
                    title={draft.imageName ?? undefined}
                  >
                    {draft.imageName}
                  </span>
                  <button
                    type="button"
                    className="sym-icon-btn sym-icon-btn--danger sym-service-spec-vendor-form__remove-image"
                    aria-label="Remove image"
                    onClick={removeImage}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      delete
                    </span>
                  </button>
                </>
              ) : (
                <span className="sym-service-spec-vendor-form__upload-label">Upload Image</span>
              )}
            </div>
          </div>

          <SymImagePreviewModal
            open={imagePreviewOpen}
            src={draft.imagePreviewUrl ?? ''}
            alt={draft.imageName ? `Preview ${draft.imageName}` : 'Model image preview'}
            onClose={() => setImagePreviewOpen(false)}
          />

          <div className="sym-service-spec-vendor-form__actions">
            <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={closeForm}>
              Cancel
            </button>
            <button
              type="button"
              className="sym-btn-filled-primary sym-btn--sm"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save Model
            </button>
          </div>
        </div>
      ) : null}

      {!formOpen ? (
        <div className="sym-service-spec-column__list-wrap" role="listbox" aria-label="Model">
          {filtered.length === 0 ? (
            <p className="sym-service-spec-column__empty">No results found</p>
          ) : (
            <ul className="sym-service-spec-column__list">
              {filtered.map((model) => {
                const selected = model.id === selectedId
                return (
                <li key={model.id}>
                  <ServiceSpecCascadeItem
                    label={model.name}
                    selected={selected}
                    preview={
                      model.imageUrl
                        ? {
                            icon: 'photo_camera',
                            ariaLabel: `Preview ${model.name} image`,
                            onClick: () =>
                              setListImagePreview({
                                url: model.imageUrl!,
                                alt: model.imageName
                                  ? `Preview ${model.imageName}`
                                  : `Preview ${model.name} image`,
                              }),
                          }
                        : undefined
                    }
                    onSelect={() => onSelect(model.id)}
                    onEdit={() => openEditForm(model)}
                    onDelete={() => onDelete(model.id)}
                    editAriaLabel={`Edit ${model.name}`}
                    deleteAriaLabel={`Delete ${model.name}`}
                  />
                </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      <SymImagePreviewModal
        open={listImagePreview !== null}
        src={listImagePreview?.url ?? ''}
        alt={listImagePreview?.alt ?? 'Model image preview'}
        onClose={() => setListImagePreview(null)}
      />
    </article>
  )
}
