import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ServiceSpecVendor } from '../data/serviceSpecMockData'
import { readFileAsDataUrl } from '../utils/serviceSpecAttachment'
import { ServiceSpecCascadeItem } from './ServiceSpecCascadeItem'
import { SymImagePreviewModal } from './SymImagePreviewModal'

export type VendorFormDraft = {
  name: string
  description: string
  imageFile: File | null
  imagePreviewUrl: string | null
  imageName: string | null
}

type VendorFormMode = { kind: 'add' } | { kind: 'edit'; vendorId: string }

const emptyDraft = (): VendorFormDraft => ({
  name: '',
  description: '',
  imageFile: null,
  imagePreviewUrl: null,
  imageName: null,
})

function draftFromVendor(vendor: ServiceSpecVendor): VendorFormDraft {
  return {
    name: vendor.name,
    description: vendor.description ?? '',
    imageFile: null,
    imagePreviewUrl: vendor.imageUrl ?? null,
    imageName: vendor.imageName ?? null,
  }
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ServiceSpecVendorColumnProps = {
  vendors: ServiceSpecVendor[]
  selectedId: string | null
  onSelect: (id: string) => void
  onSave: (vendor: ServiceSpecVendor, mode: 'add' | 'edit') => void
  onDelete: (id: string) => void
}

export function ServiceSpecVendorColumn({
  vendors,
  selectedId,
  onSelect,
  onSave,
  onDelete,
}: ServiceSpecVendorColumnProps) {
  const searchId = useId()
  const nameId = useId()
  const descriptionId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [formMode, setFormMode] = useState<VendorFormMode | null>(null)
  const [draft, setDraft] = useState<VendorFormDraft>(emptyDraft)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [listImagePreview, setListImagePreview] = useState<{ url: string; alt: string } | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vendors
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.description ?? '').toLowerCase().includes(q),
    )
  }, [vendors, query])

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

  function openEditForm(vendor: ServiceSpecVendor) {
    setFormMode({ kind: 'edit', vendorId: vendor.id })
    setDraft(draftFromVendor(vendor))
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
    if (draft.imageFile) {
      imageUrl = await readFileAsDataUrl(draft.imageFile)
    }

    if (formMode?.kind === 'edit') {
      const existing = vendors.find((v) => v.id === formMode.vendorId)
      if (!existing) return
      onSave(
        {
          ...existing,
          name,
          description: description || undefined,
          imageUrl,
          imageName,
        },
        'edit',
      )
    } else {
      const baseId = slugify(name) || 'vendor'
      let id = baseId
      let n = 1
      while (vendors.some((v) => v.id === id)) {
        id = `${baseId}-${n}`
        n += 1
      }
      onSave(
        {
          id,
          name,
          description: description || undefined,
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
        <h2 className="sym-service-spec-column__title">Vendor</h2>
        {!formOpen ? (
          <button type="button" className="sym-btn-outlined-labeled sym-btn--sm" onClick={openAddForm}>
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Vendor
          </button>
        ) : (
          <button
            type="button"
            className="sym-btn-outlined-labeled sym-btn--sm sym-service-spec-vendor-form__header-add"
            aria-label="Add vendor form open"
            aria-pressed
            disabled
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Vendor
          </button>
        )}
      </header>

      {!formOpen ? (
        <div className="sym-service-spec-column__search-wrap">
          <label className="visually-hidden" htmlFor={searchId}>
            Search vendor
          </label>
          <input
            id={searchId}
            type="search"
            className="form-control sym-form-control sym-service-spec-column__search"
            placeholder="Search vendor"
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
          className="sym-service-spec-vendor-form"
          aria-label={formMode?.kind === 'edit' ? 'Edit vendor' : 'Add vendor'}
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
                placeholder="Vendor name"
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
                  aria-label={`View ${draft.imageName ?? 'vendor image'} in full size`}
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
                  aria-label="Upload vendor image"
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
            alt={draft.imageName ? `Preview ${draft.imageName}` : 'Vendor image preview'}
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
              Save Vendor
            </button>
          </div>
        </div>
      ) : null}

      {!formOpen ? (
        <div className="sym-service-spec-column__list-wrap" role="listbox" aria-label="Vendor">
          {filtered.length === 0 ? (
            <p className="sym-service-spec-column__empty">No results found</p>
          ) : (
            <ul className="sym-service-spec-column__list">
              {filtered.map((vendor) => {
                const selected = vendor.id === selectedId
                return (
                <li key={vendor.id}>
                  <ServiceSpecCascadeItem
                    label={vendor.name}
                    selected={selected}
                    preview={
                      vendor.imageUrl
                        ? {
                            icon: 'photo_camera',
                            ariaLabel: `Preview ${vendor.name} image`,
                            onClick: () =>
                              setListImagePreview({
                                url: vendor.imageUrl!,
                                alt: vendor.imageName
                                  ? `Preview ${vendor.imageName}`
                                  : `Preview ${vendor.name} image`,
                              }),
                          }
                        : undefined
                    }
                    onSelect={() => onSelect(vendor.id)}
                    onEdit={() => openEditForm(vendor)}
                    onDelete={() => onDelete(vendor.id)}
                    editAriaLabel={`Edit ${vendor.name}`}
                    deleteAriaLabel={`Delete ${vendor.name}`}
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
        alt={listImagePreview?.alt ?? 'Vendor image preview'}
        onClose={() => setListImagePreview(null)}
      />
    </article>
  )
}
