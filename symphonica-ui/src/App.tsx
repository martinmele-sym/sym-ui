import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { SymAppHeader, type AppHeaderBreadcrumbSegment } from './components/SymAppHeader'
import { SymSidebar } from './components/SymSidebar'
import { PROCESS_SELECTION_RULES } from './data/processSelectionRulesMockData'
import { PartyDomainShowcase } from './showcase/PartyDomainShowcase'
import { ProcessSelectionRulesShowcase } from './showcase/ProcessSelectionRulesShowcase'
import { RulesAndConditionsShowcase } from './showcase/RulesAndConditionsShowcase'
import { ServiceDomainShowcase } from './showcase/ServiceDomainShowcase'
import { ServiceSpecDashboardShowcase } from './showcase/ServiceSpecDashboardShowcase'
import { SymphonicaShowcase } from './showcase/SymphonicaShowcase'

function AppLayout() {
  const { pathname } = useLocation()
  const { selectionRuleId } = useParams<{ selectionRuleId?: string }>()
  const headerVariant = pathname === '/service-orders' ? 'small' : 'large'
  const selectionRule = selectionRuleId
    ? PROCESS_SELECTION_RULES.find((row) => row.id === selectionRuleId)
    : undefined

  const breadcrumbItems: AppHeaderBreadcrumbSegment[] =
    pathname === '/device-management'
      ? [
          { label: 'Resource Domain', href: '/device-management', leadingHome: true },
          { label: 'Device Management', current: true },
        ]
      : pathname === '/service-orders'
      ? [
          { label: 'Customer Details', href: '/', leadingHome: true },
          { label: 'Telefónica', href: '/' },
          { label: 'Service orders', current: true },
        ]
      : pathname === '/party-domain'
        ? [
            { label: 'Customer Details', href: '/', leadingHome: true },
            { label: 'Telefónica', href: '/' },
            { label: 'Party domain', current: true },
          ]
        : pathname === '/service-domain'
          ? [
              { label: 'Service Domain', href: '/service-domain', leadingHome: true },
              { label: 'Service specifications', href: '/service-domain' },
              { label: 'Create', current: true },
            ]
          : pathname.includes('/rules-and-conditions') && selectionRule
            ? [
                { label: 'Workflow Domain', href: '/process-selection-rules', leadingHome: true },
                { label: 'Process Selection Rules', href: '/process-selection-rules' },
                {
                  label: 'Rules and Conditions',
                  href: `/process-selection-rules/${selectionRule.id}/rules-and-conditions`,
                },
                { label: selectionRule.serviceSpecification, current: true },
              ]
            : pathname === '/process-selection-rules'
              ? [
                  { label: 'Workflow Domain', href: '/process-selection-rules', leadingHome: true },
                  { label: 'Process Selection Rules', current: true },
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
        <Route path="party-domain" element={<PartyDomainShowcase />} />
        <Route path="service-domain" element={<ServiceDomainShowcase />} />
        <Route path="process-selection-rules" element={<ProcessSelectionRulesShowcase />} />
        <Route
          path="process-selection-rules/:selectionRuleId/rules-and-conditions"
          element={<RulesAndConditionsShowcase />}
        />
        <Route path="device-management" element={<ServiceSpecDashboardShowcase />} />
        <Route path="device-management-2" element={<Navigate to="/device-management" replace />} />
        <Route path="service-orders" element={<SymphonicaShowcase mode="serviceOrders" />} />
      </Route>
    </Routes>
  )
}
