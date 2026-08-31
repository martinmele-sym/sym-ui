type ServiceSpecCascadeBreadcrumbProps = {
  vendorName?: string
  modelName?: string
  versionName?: string
}

/** Card header selection path — Vendor > Model > Version (Figma 8899:30779). */
export function ServiceSpecCascadeBreadcrumb({
  vendorName,
  modelName,
  versionName,
}: ServiceSpecCascadeBreadcrumbProps) {
  const segments = [
    vendorName ?? '—',
    modelName ?? '—',
    versionName ?? '—',
  ]

  return (
    <p className="sym-card-header__selection-path mb-0">
      <span className="sym-card-header__selection-value">
        {segments.map((label, index) => (
          <span key={index}>
            {index > 0 ? (
              <span className="sym-card-header__selection-separator" aria-hidden>
                {' '}
                &gt;{' '}
              </span>
            ) : null}
            {label}
          </span>
        ))}
      </span>
    </p>
  )
}
