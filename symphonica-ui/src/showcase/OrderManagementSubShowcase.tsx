/** POC shell for Order Management sub-destinations not yet fully built out. */
export function OrderManagementSubShowcase({ title }: { title: string }) {
  return (
    <div className="sym-page">
      <article className="sym-card-primary sym-no-hover">
        <header className="sym-card-header">
          <div className="sym-card-header__top">
            <h1 className="sym-card-title">{title}</h1>
          </div>
        </header>
        <div className="sym-card-body">
          <p className="mb-0">POC placeholder — wire product screens for {title}.</p>
        </div>
      </article>
    </div>
  )
}
