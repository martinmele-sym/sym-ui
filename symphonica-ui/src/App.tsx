import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { SymAppHeader, type AppHeaderBreadcrumbSegment } from './components/SymAppHeader'
import { SymSidebar } from './components/SymSidebar'
import {
  GLOBAL_DOMAIN_SUBROUTES,
  INTEGRATION_DOMAIN_SUBROUTES,
  ORDER_MANAGEMENT_SUBROUTES,
  RESOURCE_DOMAIN_SUBROUTES,
  SERVICE_DOMAIN_SUBROUTES,
  WORKFLOW_DOMAIN_SUBROUTES,
  findGlobalDomainSubRoute,
  findIntegrationDomainSubRoute,
  findOrderManagementSubRoute,
  findResourceDomainSubRoute,
  findServiceDomainSubRoute,
  findWorkflowDomainSubRoute,
  globalDomainHref,
  integrationDomainHref,
  orderManagementHref,
  resourceDomainHref,
  serviceDomainHref,
  workflowDomainHref,
  workflowProcessSelectionRulesHref,
  type DomainSubRoute,
} from './data/appNavConfig'
import { PROCESS_SELECTION_RULES } from './data/processSelectionRulesMockData'
import { OrderManagementSubShowcase } from './showcase/OrderManagementSubShowcase'
import { PartyDomainShowcase } from './showcase/PartyDomainShowcase'
import { ProcessSelectionRulesShowcase } from './showcase/ProcessSelectionRulesShowcase'
import { RulesAndConditionsShowcase } from './showcase/RulesAndConditionsShowcase'
import { ServiceDomainShowcase } from './showcase/ServiceDomainShowcase'
import { ResourceInventoryShowcase } from './showcase/ResourceInventoryShowcase'
import { ServiceSpecDashboardShowcase } from './showcase/ServiceSpecDashboardShowcase'
import { SymphonicaShowcase } from './showcase/SymphonicaShowcase'

function LegacyRulesAndConditionsRedirect() {
  const { selectionRuleId } = useParams<{ selectionRuleId: string }>()
  return (
    <Navigate
      to={workflowProcessSelectionRulesHref(selectionRuleId)}
      replace
    />
  )
}

function renderDomainSubRoute(row: DomainSubRoute) {
  switch (row.showcase) {
    case 'serviceOrders':
      return <SymphonicaShowcase mode="serviceOrders" />
    case 'serviceSpecifications':
      return <ServiceDomainShowcase />
    case 'processSelectionRules':
      return <ProcessSelectionRulesShowcase />
    case 'deviceManager':
      return <ServiceSpecDashboardShowcase />
    case 'resourceInventory':
      return <ResourceInventoryShowcase />
    default:
      return <OrderManagementSubShowcase title={row.title} />
  }
}

function AppLayout() {
  const { pathname } = useLocation()
  const { selectionRuleId } = useParams<{ selectionRuleId?: string }>()
  const orderMgmtRoute = findOrderManagementSubRoute(pathname)
  const serviceDomainRoute = findServiceDomainSubRoute(pathname)
  const workflowDomainRoute = findWorkflowDomainSubRoute(pathname)
  const resourceDomainRoute = findResourceDomainSubRoute(pathname)
  const integrationDomainRoute = findIntegrationDomainSubRoute(pathname)
  const globalDomainRoute = findGlobalDomainSubRoute(pathname)
  const headerVariant = pathname.startsWith('/order-management/') ? 'small' : 'large'
  const selectionRule = selectionRuleId
    ? PROCESS_SELECTION_RULES.find((row) => row.id === selectionRuleId)
    : undefined

  const breadcrumbItems: AppHeaderBreadcrumbSegment[] =
    orderMgmtRoute
      ? [
          {
            label: 'Order Management',
            href: orderManagementHref('service-orders'),
            leadingHome: true,
          },
          { label: orderMgmtRoute.title, current: true },
        ]
      : pathname === '/customer-search'
        ? [
            { label: 'Party Domain', href: '/customer-search', leadingHome: true },
            { label: 'Customer Search', current: true },
          ]
        : pathname === '/party-domain'
          ? [
              { label: 'Customer Details', href: '/', leadingHome: true },
              { label: 'Telefónica', href: '/' },
              { label: 'Party domain', current: true },
            ]
          : serviceDomainRoute
            ? [
                {
                  label: 'Service Domain',
                  href: serviceDomainHref('service-specifications'),
                  leadingHome: true,
                },
                { label: serviceDomainRoute.title, current: true },
              ]
            : pathname.includes('/rules-and-conditions') && selectionRule
              ? [
                  {
                    label: 'Workflow Domain',
                    href: workflowDomainHref('process-selection-rules'),
                    leadingHome: true,
                  },
                  {
                    label: 'Process Selection Rules',
                    href: workflowDomainHref('process-selection-rules'),
                  },
                  {
                    label: 'Rules and Conditions',
                    href: workflowProcessSelectionRulesHref(selectionRule.id),
                  },
                  { label: selectionRule.serviceSpecification, current: true },
                ]
              : workflowDomainRoute
                ? [
                    {
                      label: 'Workflow Domain',
                      href: workflowDomainHref('process-selection-rules'),
                      leadingHome: true,
                    },
                    { label: workflowDomainRoute.title, current: true },
                  ]
                : resourceDomainRoute
                  ? [
                      {
                        label: 'Resource Domain',
                        href: resourceDomainHref('device-manager'),
                        leadingHome: true,
                      },
                      { label: resourceDomainRoute.title, current: true },
                    ]
                  : integrationDomainRoute
                    ? [
                        {
                          label: 'Integration Domain',
                          href: integrationDomainHref('integration-studio'),
                          leadingHome: true,
                        },
                        { label: integrationDomainRoute.title, current: true },
                      ]
                    : globalDomainRoute
                      ? [
                          {
                            label: 'Global',
                            href: globalDomainHref('categories'),
                            leadingHome: true,
                          },
                          { label: globalDomainRoute.title, current: true },
                        ]
                      : [
                      { label: 'Customer Details', href: '/', leadingHome: true },
                      { label: 'Telefónica', current: true },
                    ]

  return (
    <div className="sym-app-shell">
      <SymSidebar />
      <main className={`sym-app-main sym-app-main--header-${headerVariant}`}>
        <SymAppHeader variant={headerVariant} breadcrumbItems={breadcrumbItems} />
        <div className="sym-app-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SymphonicaShowcase mode="home" />} />
        <Route path="customer-search" element={<SymphonicaShowcase mode="home" />} />
        <Route path="party-domain" element={<PartyDomainShowcase />} />
        <Route
          path="service-domain"
          element={<Navigate to="/service-domain/service-specifications" replace />}
        />
        {SERVICE_DOMAIN_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`service-domain/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
        <Route
          path="workflow-domain"
          element={<Navigate to="/workflow-domain/process-selection-rules" replace />}
        />
        {WORKFLOW_DOMAIN_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`workflow-domain/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
        <Route
          path="workflow-domain/process-selection-rules/:selectionRuleId/rules-and-conditions"
          element={<RulesAndConditionsShowcase />}
        />
        <Route
          path="process-selection-rules"
          element={<Navigate to="/workflow-domain/process-selection-rules" replace />}
        />
        <Route
          path="process-selection-rules/:selectionRuleId/rules-and-conditions"
          element={<LegacyRulesAndConditionsRedirect />}
        />
        <Route
          path="resource-domain"
          element={<Navigate to="/resource-domain/device-manager" replace />}
        />
        {RESOURCE_DOMAIN_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`resource-domain/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
        <Route
          path="integration-domain"
          element={<Navigate to="/integration-domain/integration-studio" replace />}
        />
        {INTEGRATION_DOMAIN_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`integration-domain/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
        <Route path="global" element={<Navigate to="/global/categories" replace />} />
        {GLOBAL_DOMAIN_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`global/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
        <Route
          path="device-management"
          element={<Navigate to="/resource-domain/device-manager" replace />}
        />
        <Route
          path="device-management-2"
          element={<Navigate to="/resource-domain/device-manager" replace />}
        />
        <Route
          path="service-orders"
          element={<Navigate to="/order-management/service-orders" replace />}
        />
        {ORDER_MANAGEMENT_SUBROUTES.map((row) => (
          <Route
            key={row.path}
            path={`order-management/${row.path}`}
            element={renderDomainSubRoute(row)}
          />
        ))}
      </Route>
    </Routes>
  )
}
