import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { SymAppHeader, type AppHeaderBreadcrumbSegment } from './components/SymAppHeader'
import { SymSidebar } from './components/SymSidebar'
import { SymphonicaShowcase } from './showcase/SymphonicaShowcase'

function AppLayout() {
  const { pathname } = useLocation()
  const headerVariant = pathname === '/service-orders' ? 'small' : 'large'

  const breadcrumbItems: AppHeaderBreadcrumbSegment[] =
    pathname === '/service-orders'
      ? [
          { label: 'Customer Details', href: '/', leadingHome: true },
          { label: 'Telefónica', href: '/' },
          { label: 'Service orders', current: true },
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
        <Route path="service-orders" element={<SymphonicaShowcase mode="serviceOrders" />} />
      </Route>
    </Routes>
  )
}
