import { useId } from 'react'
import { Link } from 'react-router-dom'

export type AppHeaderVariant = 'small' | 'large'

export type AppHeaderBreadcrumbSegment =
  | { label: string; href: string; leadingHome?: boolean }
  | { label: string; current: true }

export function SymAppHeader({
  variant,
  breadcrumbItems,
}: {
  variant: AppHeaderVariant
  breadcrumbItems: AppHeaderBreadcrumbSegment[]
}) {
  const searchId = useId()
  const breadcrumbNavId = useId()

  return (
    <header className={`sym-app-header sym-app-header--${variant}`} role="banner">
      <div className="sym-app-header__inner">
        <div className="sym-app-header__nav-row">
          <div className="sym-app-header__nav-row-main">
            <div className="sym-app-header__search-wrap">
              <label className="visually-hidden" htmlFor={searchId}>
                Search
              </label>
              <input
                id={searchId}
                type="search"
                className="form-control sym-app-header__search-input"
                placeholder="Search"
                autoComplete="off"
              />
              <span className="material-icons-outlined sym-app-header__search-suffix" aria-hidden>
                search
              </span>
            </div>
          </div>

          <div className="sym-app-header__nav-row-actions">
            <div className="sym-app-header__utilities" aria-label="Header utilities">
              <button type="button" className="sym-app-header__icon-btn" aria-label="Documentation">
                <span className="material-icons-outlined" aria-hidden>
                  description
                </span>
              </button>
              <button type="button" className="sym-app-header__icon-btn" aria-label="Applications">
                <span className="material-icons-outlined" aria-hidden>
                  apps
                </span>
              </button>
              <button type="button" className="sym-app-header__icon-btn" aria-label="Developer tools">
                <span className="material-icons-outlined" aria-hidden>
                  developer_board
                </span>
              </button>
              <button type="button" className="sym-app-header__icon-btn" aria-label="Locale">
                <span className="material-icons-outlined" aria-hidden>
                  flag
                </span>
              </button>
            </div>

            <div className="sym-app-header__user">
              <span className="material-icons-outlined sym-app-header__user-icon" aria-hidden>
                account_circle
              </span>
              <span className="sym-app-header__user-email">paulthomasanderson@intraway.com</span>
            </div>
          </div>
        </div>

        <div className="sym-app-header__breadcrumb-zone">
          <nav aria-label="Breadcrumb" id={breadcrumbNavId}>
            <ol
              className={`breadcrumb sym-app-header__breadcrumb mb-0${variant === 'large' ? ' sym-app-header__breadcrumb--on-brand' : ''}`}
            >
              {breadcrumbItems.map((item, i) => {
                if ('current' in item && item.current) {
                  return (
                    <li
                      key={`${item.label}-${i}`}
                      className="breadcrumb-item active sym-app-header__crumb-current"
                      aria-current="page"
                    >
                      {item.label}
                    </li>
                  )
                }
                if (!('href' in item)) return null
                const { label, href, leadingHome } = item
                const className = leadingHome
                  ? 'sym-app-header__crumb sym-app-header__crumb--home'
                  : 'sym-app-header__crumb'
                const inner = (
                  <>
                    {leadingHome ? (
                      <span className="material-icons-outlined sym-app-header__home-icon" aria-hidden>
                        home
                      </span>
                    ) : null}
                    <span>{label}</span>
                  </>
                )
                const internal = href.startsWith('/')
                return (
                  <li key={`${label}-${href}-${i}`} className="breadcrumb-item">
                    {internal ? (
                      <Link to={href} className={className}>
                        {inner}
                      </Link>
                    ) : (
                      <a href={href} className={className}>
                        {inner}
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
          <button type="button" className="sym-app-header__icon-btn sym-app-header__help-btn" aria-label="Help">
            <span className="material-icons-outlined" aria-hidden>
              help_outline
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
