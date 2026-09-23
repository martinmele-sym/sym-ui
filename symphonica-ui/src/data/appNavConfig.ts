/** Sidebar + router source of truth for expandable domain sub-destinations. */

export type DomainSubRoute = {
  id: string
  path: string
  title: string
  showcase?:
    | 'serviceOrders'
    | 'serviceSpecifications'
    | 'processSelectionRules'
    | 'deviceManager'
    | 'resourceInventory'
  badge?: string
  /** Guía trailing open_in_new; default true when omitted. */
  externalLink?: boolean
}

export type OrderManagementSubRoute = DomainSubRoute

export const ORDER_MANAGEMENT_SUBROUTES: OrderManagementSubRoute[] = [
  { id: 'service-orders', path: 'service-orders', title: 'Service Orders', showcase: 'serviceOrders' },
  { id: 'cancel-service-orders', path: 'cancel-service-orders', title: 'Cancel Service Orders' },
  { id: 'workflow-orders', path: 'workflow-orders', title: 'Workflow Orders' },
  { id: 'cancel-workflow-orders', path: 'cancel-workflow-orders', title: 'Cancel Workflow Orders' },
  { id: 'resource-orders', path: 'resource-orders', title: 'Resource Orders' },
  {
    id: 'integration-orders',
    path: 'integration-orders',
    title: 'Integration Orders',
    badge: 'NEW',
  },
  {
    id: 'scheduled-orders',
    path: 'scheduled-orders',
    title: 'Scheduled Orders',
    badge: 'NEW',
  },
  { id: 'bulk-orders', path: 'bulk-orders', title: 'Bulk Orders' },
  { id: 'user-tasks', path: 'user-tasks', title: 'User Tasks' },
]

export function orderManagementHref(path: string): string {
  return `/order-management/${path}`
}

export function findOrderManagementSubRoute(pathname: string): OrderManagementSubRoute | undefined {
  if (!pathname.startsWith('/order-management/')) return undefined
  const slug = pathname.slice('/order-management/'.length).split('/')[0]
  return ORDER_MANAGEMENT_SUBROUTES.find((row) => row.path === slug)
}

export const SERVICE_DOMAIN_SUBROUTES: DomainSubRoute[] = [
  { id: 'catalog', path: 'catalog', title: 'Catalog' },
  {
    id: 'service-specifications',
    path: 'service-specifications',
    title: 'Service Specifications',
    showcase: 'serviceSpecifications',
  },
  { id: 'test-specifications', path: 'test-specifications', title: 'Test Specifications' },
  { id: 'extra-values', path: 'extra-values', title: 'Extra Values' },
  { id: 'order-types', path: 'order-types', title: 'Order Types' },
]

export function serviceDomainHref(path: string): string {
  return `/service-domain/${path}`
}

export function findServiceDomainSubRoute(pathname: string): DomainSubRoute | undefined {
  if (!pathname.startsWith('/service-domain/')) return undefined
  const slug = pathname.slice('/service-domain/'.length).split('/')[0]
  return SERVICE_DOMAIN_SUBROUTES.find((row) => row.path === slug)
}

export const WORKFLOW_DOMAIN_SUBROUTES: DomainSubRoute[] = [
  { id: 'workflow-order-test', path: 'workflow-order-test', title: 'Workflow Order Test' },
  { id: 'workflow-order-spec', path: 'workflow-order-spec', title: 'Workflow Order Spec' },
  {
    id: 'process-selection-rules',
    path: 'process-selection-rules',
    title: 'Process Selection Rules',
    showcase: 'processSelectionRules',
  },
  { id: 'process-manager', path: 'process-manager', title: 'Process Manager' },
  {
    id: 'workflow-manager',
    path: 'workflow-manager',
    title: 'Workflow Manager',
    badge: 'NEW',
  },
]

export function workflowDomainHref(path: string): string {
  return `/workflow-domain/${path}`
}

export function findWorkflowDomainSubRoute(pathname: string): DomainSubRoute | undefined {
  if (!pathname.startsWith('/workflow-domain/')) return undefined
  const slug = pathname.slice('/workflow-domain/'.length).split('/')[0]
  return WORKFLOW_DOMAIN_SUBROUTES.find((row) => row.path === slug)
}

export function workflowProcessSelectionRulesHref(selectionRuleId?: string): string {
  const base = workflowDomainHref('process-selection-rules')
  return selectionRuleId ? `${base}/${selectionRuleId}/rules-and-conditions` : base
}

export const RESOURCE_DOMAIN_SUBROUTES: DomainSubRoute[] = [
  {
    id: 'connector-studio',
    path: 'connector-studio',
    title: 'Connector Studio',
    badge: 'NEW',
  },
  {
    id: 'device-manager',
    path: 'device-manager',
    title: 'Device Manager',
    showcase: 'deviceManager',
  },
  {
    id: 'resource-specification-types',
    path: 'resource-specification-types',
    title: 'Resource Specification Types',
    badge: 'NEW',
  },
  { id: 'resource-specification', path: 'resource-specification', title: 'Resource Specification' },
  {
    id: 'resource-inventory',
    path: 'resource-inventory',
    title: 'Resource Inventory',
    showcase: 'resourceInventory',
  },
  { id: 'resource-commands', path: 'resource-commands', title: 'Resource Commands' },
  { id: 'resource-order-spec', path: 'resource-order-spec', title: 'Resource Order Spec' },
  { id: 'resource-order-test', path: 'resource-order-test', title: 'Resource Order Test' },
  { id: 'constants', path: 'constants', title: 'Constants' },
  { id: 'errors', path: 'errors', title: 'Errors' },
  { id: 'translations', path: 'translations', title: 'Translations' },
  { id: 'connector-cluster', path: 'connector-cluster', title: 'Connector Cluster' },
]

export function resourceDomainHref(path: string): string {
  return `/resource-domain/${path}`
}

export function findResourceDomainSubRoute(pathname: string): DomainSubRoute | undefined {
  if (!pathname.startsWith('/resource-domain/')) return undefined
  const slug = pathname.slice('/resource-domain/'.length).split('/')[0]
  return RESOURCE_DOMAIN_SUBROUTES.find((row) => row.path === slug)
}

export const INTEGRATION_DOMAIN_SUBROUTES: DomainSubRoute[] = [
  { id: 'integration-studio', path: 'integration-studio', title: 'Integration Studio' },
  { id: 'storage-explorer', path: 'storage-explorer', title: 'Storage Explorer' },
]

export function integrationDomainHref(path: string): string {
  return `/integration-domain/${path}`
}

export function findIntegrationDomainSubRoute(pathname: string): DomainSubRoute | undefined {
  if (!pathname.startsWith('/integration-domain/')) return undefined
  const slug = pathname.slice('/integration-domain/'.length).split('/')[0]
  return INTEGRATION_DOMAIN_SUBROUTES.find((row) => row.path === slug)
}

export const GLOBAL_DOMAIN_SUBROUTES: DomainSubRoute[] = [
  { id: 'categories', path: 'categories', title: 'Categories' },
  { id: 'regions', path: 'regions', title: 'Regions' },
  { id: 'sources', path: 'sources', title: 'Sources' },
  { id: 'bulk-loader', path: 'bulk-loader', title: 'Bulk Loader' },
  { id: 'import-export', path: 'import-export', title: 'Import/Export', externalLink: false },
  {
    id: 'maintenance-mode',
    path: 'maintenance-mode',
    title: 'Maintenance Mode',
    badge: 'NEW',
  },
  { id: 'mcp-server', path: 'mcp-server', title: 'MCP Server', badge: 'NEW' },
]

export function globalDomainHref(path: string): string {
  return `/global/${path}`
}

export function findGlobalDomainSubRoute(pathname: string): DomainSubRoute | undefined {
  if (!pathname.startsWith('/global/')) return undefined
  const slug = pathname.slice('/global/'.length).split('/')[0]
  return GLOBAL_DOMAIN_SUBROUTES.find((row) => row.path === slug)
}
