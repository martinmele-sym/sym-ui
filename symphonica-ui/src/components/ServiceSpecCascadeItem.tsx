import type { ReactNode } from 'react'

type ServiceSpecCascadePreview = {
  icon: 'photo_camera' | 'attach_file'
  ariaLabel: string
  onClick: () => void
}

type ServiceSpecCascadeItemProps = {
  label: string
  selected: boolean
  showChevron?: boolean
  leading?: ReactNode
  preview?: ServiceSpecCascadePreview
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  editAriaLabel: string
  deleteAriaLabel: string
}

export function ServiceSpecCascadeItem({
  label,
  selected,
  showChevron = true,
  leading,
  preview,
  onSelect,
  onEdit,
  onDelete,
  editAriaLabel,
  deleteAriaLabel,
}: ServiceSpecCascadeItemProps) {
  return (
    <div
      role="option"
      aria-selected={selected}
      className={`sym-service-spec-item${selected ? ' sym-service-spec-item--selected' : ''}`}
    >
      <button type="button" className="sym-service-spec-item__main" onClick={onSelect}>
        {leading}
        <span className="sym-service-spec-item__label">{label}</span>
      </button>
      <div className="sym-service-spec-item__actions">
        <div className="sym-service-spec-item__item-actions">
          <button
            type="button"
            className="sym-icon-btn sym-icon-btn--primary sym-service-spec-item__icon-btn"
            aria-label={editAriaLabel}
            onClick={onEdit}
          >
            <span className="material-icons-outlined" aria-hidden>
              edit
            </span>
          </button>
          {preview ? (
            <button
              type="button"
              className="sym-icon-btn sym-icon-btn--primary sym-service-spec-item__icon-btn"
              aria-label={preview.ariaLabel}
              onClick={preview.onClick}
            >
              <span className="material-icons-outlined" aria-hidden>
                {preview.icon}
              </span>
            </button>
          ) : null}
          <button
            type="button"
            className="sym-icon-btn sym-icon-btn--danger sym-service-spec-item__icon-btn"
            aria-label={deleteAriaLabel}
            onClick={onDelete}
          >
            <span className="material-icons-outlined" aria-hidden>
              delete
            </span>
          </button>
        </div>
        {showChevron ? (
          <span className="material-icons-outlined sym-service-spec-item__chevron" aria-hidden>
            chevron_right
          </span>
        ) : null}
      </div>
    </div>
  )
}
