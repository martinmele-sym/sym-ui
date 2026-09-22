import { useEffect, useId, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  GLOBAL_DOMAIN_SUBROUTES,
  INTEGRATION_DOMAIN_SUBROUTES,
  ORDER_MANAGEMENT_SUBROUTES,
  RESOURCE_DOMAIN_SUBROUTES,
  SERVICE_DOMAIN_SUBROUTES,
  WORKFLOW_DOMAIN_SUBROUTES,
  globalDomainHref,
  integrationDomainHref,
  orderManagementHref,
  resourceDomainHref,
  serviceDomainHref,
  workflowDomainHref,
} from '../data/appNavConfig'

type NavSubItem = {
  id: string
  label: string
  to: string
  /** Trailing open_in_new glyph — cross-surface navigation cue per Guía. */
  externalLink?: boolean
  badge?: string
}

type NavItemIconVar =
  | '--component-nav-sidebar-item-icon-home'
  | '--component-nav-sidebar-item-icon-party-domain'
  | '--component-nav-sidebar-item-icon-order-management'
  | '--component-nav-sidebar-item-icon-service-domain'
  | '--component-nav-sidebar-item-icon-workflow-domain'
  | '--component-nav-sidebar-item-icon-resource-domain'
  | '--component-nav-sidebar-item-icon-integration-domain'
  | '--component-nav-sidebar-item-icon-global'

type NavItem = {
  id: string
  label: string
  icon: string
  /** Internal route when set; otherwise local-only nav row */
  to?: string
  iconColorVar: NavItemIconVar
  showChevron?: boolean
  badge?: string
  children?: NavSubItem[]
}

/** Primary shell menu — Guía Figma 7089:7392 (8 domain rows). */
const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    to: '/',
    iconColorVar: '--component-nav-sidebar-item-icon-home',
    showChevron: false,
  },
  {
    id: 'party-domain',
    label: 'Party Domain',
    icon: 'groups',
    iconColorVar: '--component-nav-sidebar-item-icon-party-domain',
    children: [
      { id: 'customer-search', label: 'Customer Search', to: '/customer-search', externalLink: true },
    ],
  },
  {
    id: 'order-management',
    label: 'Order Management',
    icon: 'assignment',
    iconColorVar: '--component-nav-sidebar-item-icon-order-management',
    children: ORDER_MANAGEMENT_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: orderManagementHref(row.path),
      externalLink: true,
      badge: row.badge,
    })),
  },
  {
    id: 'service-domain',
    label: 'Service Domain',
    icon: 'layers',
    iconColorVar: '--component-nav-sidebar-item-icon-service-domain',
    children: SERVICE_DOMAIN_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: serviceDomainHref(row.path),
      externalLink: true,
      badge: row.badge,
    })),
  },
  {
    id: 'workflow-domain',
    label: 'Workflow Domain',
    icon: 'account_tree',
    iconColorVar: '--component-nav-sidebar-item-icon-workflow-domain',
    children: WORKFLOW_DOMAIN_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: workflowDomainHref(row.path),
      externalLink: true,
      badge: row.badge,
    })),
  },
  {
    id: 'resource-domain',
    label: 'Resource Domain',
    icon: 'miscellaneous_services',
    iconColorVar: '--component-nav-sidebar-item-icon-resource-domain',
    children: RESOURCE_DOMAIN_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: resourceDomainHref(row.path),
      externalLink: true,
      badge: row.badge,
    })),
  },
  {
    id: 'integration-domain',
    label: 'Integration Domain',
    icon: 'hub',
    iconColorVar: '--component-nav-sidebar-item-icon-integration-domain',
    badge: 'NEW',
    children: INTEGRATION_DOMAIN_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: integrationDomainHref(row.path),
      externalLink: true,
      badge: row.badge,
    })),
  },
  {
    id: 'global',
    label: 'Global',
    icon: 'language',
    iconColorVar: '--component-nav-sidebar-item-icon-global',
    children: GLOBAL_DOMAIN_SUBROUTES.map((row) => ({
      id: row.id,
      label: row.title,
      to: globalDomainHref(row.path),
      externalLink: row.externalLink !== false,
      badge: row.badge,
    })),
  },
]

function childRouteIsActive(pathname: string, child: NavSubItem): boolean {
  return child.to === '/' ? pathname === '/' : pathname === child.to || pathname.startsWith(`${child.to}/`)
}

function domainHasActiveChild(pathname: string, item: NavItem): boolean {
  return item.children?.some((child) => childRouteIsActive(pathname, child)) ?? false
}

export function SymSidebar() {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())
  const searchId = useId()

  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      for (const item of NAV_ITEMS) {
        if (item.children && domainHasActiveChild(pathname, item)) {
          next.add(item.id)
        }
      }
      return next
    })
  }, [pathname])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <aside
      className={`sym-sidebar${collapsed ? ' sym-sidebar--collapsed' : ''}`}
      aria-label="Symphonica primary navigation"
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
            onClick={() => setCollapsed((prev: boolean) => !prev)}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            <span className="material-icons-outlined sym-sidebar__toggle-icon" aria-hidden>
              {collapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>

        <div className="sym-sidebar__search-wrap">
          <label className="visually-hidden" htmlFor={searchId}>
            Search
          </label>
          <input
            id={searchId}
            type="search"
            className="sym-sidebar__search"
            placeholder="Search"
            autoComplete="off"
          />
          <span className="material-icons-outlined sym-sidebar__search-glyph" aria-hidden>
            search
          </span>
        </div>

        <nav className="sym-sidebar__nav" aria-label="Domains">
          <ul className="sym-sidebar__list">
            {NAV_ITEMS.map((item) => {
              const isExpanded = expandedIds.has(item.id)
              const hasActiveChild = item.children ? domainHasActiveChild(pathname, item) : false
              const parentActiveWhileCollapsed = collapsed && hasActiveChild
              const submenuId = `${item.id}-submenu`

              const linkBody = (
                <>
                  <span
                    className="material-icons-outlined sym-sidebar__leading-icon"
                    style={{ color: `var(${item.iconColorVar})` }}
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span className="sym-sidebar__label">{item.label}</span>
                  {item.badge ? (
                    <span className="sym-sidebar__badge">{item.badge}</span>
                  ) : null}
                  {item.showChevron !== false ? (
                    <span
                      className={`material-icons-outlined sym-sidebar__chevron${
                        item.children && isExpanded ? ' sym-sidebar__chevron--expanded' : ''
                      }`}
                      aria-hidden
                    >
                      {item.children && isExpanded ? 'expand_more' : 'chevron_right'}
                    </span>
                  ) : null}
                </>
              )

              if (item.children) {
                return (
                  <li key={item.id} className="sym-sidebar__item sym-sidebar__item--group">
                    <button
                      type="button"
                      className={`sym-sidebar__link sym-sidebar__link--expandable${
                        parentActiveWhileCollapsed ? ' sym-sidebar__link--child-active' : ''
                      }`}
                      aria-expanded={isExpanded}
                      aria-controls={submenuId}
                      aria-current={parentActiveWhileCollapsed ? 'page' : undefined}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      {linkBody}
                    </button>
                    {isExpanded && !collapsed ? (
                      <ul id={submenuId} className="sym-sidebar__sublist">
                        {item.children.map((child) => (
                          <li key={child.id} className="sym-sidebar__subitem">
                            <NavLink
                              to={child.to}
                              end={child.to === '/'}
                              className="sym-sidebar__sublink"
                            >
                              <span className="sym-sidebar__sublink-label">{child.label}</span>
                              {child.badge ? (
                                <span className="sym-sidebar__badge sym-sidebar__badge--sub">
                                  {child.badge}
                                </span>
                              ) : null}
                              {child.externalLink ? (
                                <span
                                  className="material-icons-outlined sym-sidebar__sublink-external"
                                  aria-hidden
                                >
                                  open_in_new
                                </span>
                              ) : null}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              }

              return (
                <li key={item.id} className="sym-sidebar__item">
                  {item.to ? (
                    <NavLink to={item.to} end={item.to === '/'} className="sym-sidebar__link">
                      {linkBody}
                    </NavLink>
                  ) : (
                    <button type="button" className="sym-sidebar__link">
                      {linkBody}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
