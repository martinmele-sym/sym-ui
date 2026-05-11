import { useId, useState } from 'react'

type NavItem = {
  id: string
  label: string
  icon: string
  /** Token: --component-nav-sidebar-item-icon-* */
  iconColorVar:
    | '--component-nav-sidebar-item-icon-home'
    | '--component-nav-sidebar-item-icon-party-domain'
    | '--component-nav-sidebar-item-icon-order-management'
    | '--component-nav-sidebar-item-icon-product-domain'
    | '--component-nav-sidebar-item-icon-service-domain'
    | '--component-nav-sidebar-item-icon-workflow-domain'
    | '--component-nav-sidebar-item-icon-resource-domain'
    | '--component-nav-sidebar-item-icon-integration-domain'
    | '--component-nav-sidebar-item-icon-global'
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: 'home',
    iconColorVar: '--component-nav-sidebar-item-icon-home',
  },
  {
    id: 'party-domain',
    label: 'Party domain',
    icon: 'corporate_fare',
    iconColorVar: '--component-nav-sidebar-item-icon-party-domain',
  },
  {
    id: 'order-management',
    label: 'Order management',
    icon: 'assignment',
    iconColorVar: '--component-nav-sidebar-item-icon-order-management',
  },
  {
    id: 'product-domain',
    label: 'Product domain',
    icon: 'category',
    iconColorVar: '--component-nav-sidebar-item-icon-product-domain',
  },
  {
    id: 'service-domain',
    label: 'Service domain',
    icon: 'design_services',
    iconColorVar: '--component-nav-sidebar-item-icon-service-domain',
  },
  {
    id: 'workflow-domain',
    label: 'Workflow domain',
    icon: 'account_tree',
    iconColorVar: '--component-nav-sidebar-item-icon-workflow-domain',
  },
  {
    id: 'resource-domain',
    label: 'Resource domain',
    icon: 'inventory_2',
    iconColorVar: '--component-nav-sidebar-item-icon-resource-domain',
  },
  {
    id: 'integration-domain',
    label: 'Integration domain',
    icon: 'hub',
    iconColorVar: '--component-nav-sidebar-item-icon-integration-domain',
  },
  {
    id: 'global',
    label: 'Global catalog',
    icon: 'public',
    iconColorVar: '--component-nav-sidebar-item-icon-global',
  },
]

export function SymSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const searchId = useId()

  return (
    <aside
      className={`sym-sidebar${collapsed ? ' sym-sidebar--collapsed' : ''}`}
      aria-label="Navegación principal Symphonica"
    >
      <div className="sym-sidebar__chrome">
        <div className="sym-sidebar__header">
          <span className="sym-sidebar__wordmark" aria-hidden={collapsed}>
            Symphonica
          </span>
          <button
            type="button"
            className="sym-sidebar__toggle"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            <span className="material-icons-outlined sym-sidebar__toggle-icon" aria-hidden>
              {collapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>

        <div className="sym-sidebar__search-wrap">
          <label className="visually-hidden" htmlFor={searchId}>
            Buscar
          </label>
          <input
            id={searchId}
            type="search"
            className="sym-sidebar__search"
            placeholder="Buscar"
            autoComplete="off"
          />
          <span className="material-icons-outlined sym-sidebar__search-glyph" aria-hidden>
            search
          </span>
        </div>

        <nav className="sym-sidebar__nav" aria-label="Dominios">
          <ul className="sym-sidebar__list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id
              return (
                <li key={item.id} className="sym-sidebar__item">
                  <button
                    type="button"
                    className="sym-sidebar__link"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActiveId(item.id)}
                  >
                    <span
                      className="material-icons-outlined sym-sidebar__leading-icon"
                      style={{ color: `var(${item.iconColorVar})` }}
                      aria-hidden
                    >
                      {item.icon}
                    </span>
                    <span className="sym-sidebar__label">{item.label}</span>
                    <span className="material-icons-outlined sym-sidebar__chevron" aria-hidden>
                      chevron_right
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
