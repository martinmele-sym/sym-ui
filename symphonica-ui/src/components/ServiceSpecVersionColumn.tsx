import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ServiceSpecVersion } from '../data/serviceSpecMockData'
import { isImageAttachment, readFileAsDataUrl } from '../utils/serviceSpecAttachment'
import { ServiceSpecCascadeItem } from './ServiceSpecCascadeItem'
import { SymImagePreviewModal } from './SymImagePreviewModal'

export type VersionFormDraft = {
  name: string
  description: string
  attachmentFile: File | null
  attachmentUrl: string | null
  attachmentName: string | null
}

type VersionFormMode = { kind: 'add' } | { kind: 'edit'; versionId: string }

const emptyDraft = (): VersionFormDraft => ({
  name: '',
  description: '',
  attachmentFile: null,
  attachmentUrl: null,
  attachmentName: null,
})

function draftFromVersion(version: ServiceSpecVersion): VersionFormDraft {
  return {
    name: version.name,
    description: version.description ?? '',
    attachmentFile: null,
    attachmentUrl: version.fileUrl ?? null,
    attachmentName: version.fileName ?? null,
  }
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ServiceSpecVersionColumnProps = {
  modelId: string
  modelName?: string
  versions: ServiceSpecVersion[]
  selectedId: string | null
  onSelect: (id: string) => void
  onSave: (version: ServiceSpecVersion, mode: 'add' | 'edit') => void
  onDelete: (id: string) => void
}

export function ServiceSpecVersionColumn({
  modelId,
  modelName,
  versions,
  selectedId,
  onSelect,
  onSave,
  onDelete,
}: ServiceSpecVersionColumnProps) {
  const searchId = useId()
  const nameId = useId()
  const descriptionId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [formMode, setFormMode] = useState<VersionFormMode | null>(null)
  const [draft, setDraft] = useState<VersionFormDraft>(emptyDraft)
  const [attachmentPreviewOpen, setAttachmentPreviewOpen] = useState(false)
  const [listAttachmentPreview, setListAttachmentPreview] = useState<{ url: string; alt: string } | null>(
    null,
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return versions
    return versions.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.description ?? '').toLowerCase().includes(q) ||
        (v.fileName ?? '').toLowerCase().includes(q),
    )
  }, [versions, query])

  const attachmentIsImage = isImageAttachment(
    draft.attachmentName,
    draft.attachmentUrl,
    draft.attachmentFile?.type ?? null,
  )

  function previewListAttachment(fileUrl: string, fileName: string, itemName: string) {
    if (isImageAttachment(fileName, fileUrl)) {
      setListAttachmentPreview({
        url: fileUrl,
        alt: fileName ? `Preview ${fileName}` : `Preview ${itemName} attachment`,
      })
      return
    }
    window.open(fileUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    return () => {
      if (draft.attachmentUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(draft.attachmentUrl)
      }
    }
  }, [draft.attachmentUrl])

  function openAddForm() {
    setFormMode({ kind: 'add' })
    setDraft(emptyDraft())
  }

  function openEditForm(version: ServiceSpecVersion) {
    setFormMode({ kind: 'edit', versionId: version.id })
    setDraft(draftFromVersion(version))
  }

  function closeForm() {
    if (draft.attachmentUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.attachmentUrl)
    }
    setAttachmentPreviewOpen(false)
    setFormMode(null)
    setDraft(emptyDraft())
  }

  function handleFilePick(file: File | undefined) {
    if (!file) return
    if (draft.attachmentUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.attachmentUrl)
    }
    const fileUrl = URL.createObjectURL(file)
    setDraft((prev) => ({
      ...prev,
      attachmentFile: file,
      attachmentUrl: fileUrl,
      attachmentName: file.name,
    }))
  }

  function removeFile() {
    if (draft.attachmentUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(draft.attachmentUrl)
    }
    setAttachmentPreviewOpen(false)
    setDraft((prev) => ({
      ...prev,
      attachmentFile: null,
      attachmentUrl: null,
      attachmentName: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function openAttachment() {
    if (!draft.attachmentUrl) return
    if (attachmentIsImage) {
      setAttachmentPreviewOpen(true)
      return
    }
    window.open(draft.attachmentUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleSave() {
    const name = draft.name.trim()
    if (!name) return

    const description = draft.description.trim()
    let fileUrl = draft.attachmentUrl ?? undefined
    const fileName = draft.attachmentName ?? undefined
    if (draft.attachmentFile) {
      fileUrl = await readFileAsDataUrl(draft.attachmentFile)
    }

    if (formMode?.kind === 'edit') {
      const existing = versions.find((v) => v.id === formMode.versionId)
      if (!existing) return
      onSave(
        {
          ...existing,
          name,
          description: description || undefined,
          fileUrl,
          fileName,
        },
        'edit',
      )
    } else {
      const baseId = slugify(name) || 'version'
      let id = baseId
      let n = 1
      while (versions.some((v) => v.id === id)) {
        id = `${baseId}-${n}`
        n += 1
      }
      onSave(
        {
          id,
          modelId,
          name,
          description: description || undefined,
          fileUrl,
          fileName,
        },
        'add',
      )
    }

    closeForm()
  }

  const formOpen = formMode !== null
  const canSave = draft.name.trim().length > 0
  const hasAttachment = Boolean(draft.attachmentUrl && draft.attachmentName)

  return (
    <article className="sym-card-primary sym-service-spec-column sym-no-hover">
      <header className="sym-service-spec-column__header">
        <h2 className="sym-service-spec-column__title">Version</h2>
        {!formOpen ? (
          <button
            type="button"
            className="sym-btn-outlined-labeled sym-btn--sm"
            onClick={openAddForm}
            disabled={!modelId}
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Version
          </button>
        ) : (
          <button
            type="button"
            className="sym-btn-outlined-labeled sym-btn--sm sym-service-spec-vendor-form__header-add"
            aria-label="Add version form open"
            aria-pressed
            disabled
          >
            <span className="material-icons-outlined" aria-hidden>
              add
            </span>
            Add Version
          </button>
        )}
      </header>

      {!formOpen ? (
        <div className="sym-service-spec-column__search-wrap">
          <label className="visually-hidden" htmlFor={searchId}>
            Search version
          </label>
          <input
            id={searchId}
            type="search"
            className="form-control sym-form-control sym-service-spec-column__search"
            placeholder="Search version"
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
          className="sym-service-spec-vendor-form sym-service-spec-version-form"
          aria-label={formMode?.kind === 'edit' ? 'Edit version' : `Add version${modelName ? ` for ${modelName}` : ''}`}
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
                placeholder="Version name"
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
                hasAttachment ? ' sym-service-spec-vendor-form__upload-card--filled' : ''
              }`}
            >
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                className="visually-hidden"
                onChange={(e) => handleFilePick(e.target.files?.[0])}
              />
              {hasAttachment ? (
                <button
                  type="button"
                  className="sym-service-spec-vendor-form__preview-btn sym-service-spec-version-form__file-preview-btn"
                  aria-label={
                    attachmentIsImage
                      ? `View ${draft.attachmentName ?? 'attachment'} in full size`
                      : `Open ${draft.attachmentName ?? 'attachment'}`
                  }
                  onClick={openAttachment}
                >
                  {attachmentIsImage ? (
                    <img
                      src={draft.attachmentUrl ?? ''}
                      alt=""
                      className="sym-service-spec-vendor-form__preview-img"
                      aria-hidden
                    />
                  ) : (
                    <span
                      className="material-icons-outlined sym-service-spec-version-form__file-preview-icon"
                      aria-hidden
                    >
                      insert_drive_file
                    </span>
                  )}
                  <span className="sym-service-spec-vendor-form__preview-overlay" aria-hidden>
                    <span className="material-icons-outlined sym-service-spec-vendor-form__preview-icon">
                      {attachmentIsImage ? 'zoom_in' : 'open_in_new'}
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="sym-btn-outlined-icon-only sym-service-spec-vendor-form__upload-btn"
                  aria-label="Upload file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-icons-outlined" aria-hidden>
                    attach_file
                  </span>
                </button>
              )}
            </div>
            <div className="sym-service-spec-vendor-form__upload-meta">
              {hasAttachment ? (
                <>
                  <span
                    className="sym-service-spec-vendor-form__upload-label sym-service-spec-vendor-form__filename"
                    title={draft.attachmentName ?? undefined}
                  >
                    {draft.attachmentName}
                  </span>
                  <button
                    type="button"
                    className="sym-icon-btn sym-icon-btn--danger sym-service-spec-vendor-form__remove-image"
                    aria-label="Remove file"
                    onClick={removeFile}
                  >
                    <span className="material-icons-outlined" aria-hidden>
                      delete
                    </span>
                  </button>
                </>
              ) : (
                <span className="sym-service-spec-vendor-form__upload-label">Attach document</span>
              )}
            </div>
          </div>

          {attachmentIsImage ? (
            <SymImagePreviewModal
              open={attachmentPreviewOpen}
              src={draft.attachmentUrl ?? ''}
              alt={draft.attachmentName ? `Preview ${draft.attachmentName}` : 'Version attachment preview'}
              onClose={() => setAttachmentPreviewOpen(false)}
            />
          ) : null}

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
              Save Version
            </button>
          </div>
        </div>
      ) : null}

      {!formOpen ? (
        <div className="sym-service-spec-column__list-wrap" role="listbox" aria-label="Version">
          {filtered.length === 0 ? (
            <p className="sym-service-spec-column__empty">No results found</p>
          ) : (
            <ul className="sym-service-spec-column__list">
              {filtered.map((version) => {
                const selected = version.id === selectedId
                return (
                  <li key={version.id}>
                    <ServiceSpecCascadeItem
                      label={version.name}
                      selected={selected}
                      showChevron={false}
                      leading={
                        version.fileName ? (
                          <span
                            className="material-icons-outlined sym-service-spec-item__file-glyph"
                            aria-hidden
                            title={version.fileName}
                          >
                            insert_drive_file
                          </span>
                        ) : undefined
                      }
                      preview={
                        version.fileUrl && version.fileName
                          ? {
                              icon: 'attach_file',
                              ariaLabel: `Preview ${version.fileName}`,
                              onClick: () =>
                                previewListAttachment(version.fileUrl!, version.fileName!, version.name),
                            }
                          : undefined
                      }
                      onSelect={() => onSelect(version.id)}
                      onEdit={() => openEditForm(version)}
                      onDelete={() => onDelete(version.id)}
                      editAriaLabel={`Edit ${version.name}`}
                      deleteAriaLabel={`Delete ${version.name}`}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      <SymImagePreviewModal
        open={listAttachmentPreview !== null}
        src={listAttachmentPreview?.url ?? ''}
        alt={listAttachmentPreview?.alt ?? 'Version attachment preview'}
        onClose={() => setListAttachmentPreview(null)}
      />
    </article>
  )
}
