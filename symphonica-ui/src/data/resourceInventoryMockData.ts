export type ResourceOperationalStatus = 'UP' | 'DOWN' | 'UNKNOWN'

export type ResourceInventoryRow = {
  id: string
  name: string
  publicIdentifier: string
  specification: string
  lifeCycleStatus: string
  hostname: string
  ipAddress: string
  port: string
  status: ResourceOperationalStatus
}

/** Visible page size for POC footer — total inventory count per Figma. */
export const RESOURCE_INVENTORY_TOTAL = 152

export const RESOURCE_INVENTORY_ROWS: ResourceInventoryRow[] = [
  {
    id: 'ri-flexiwan',
    name: 'FLEXIWAN',
    publicIdentifier: 'FLEXIWAN',
    specification: 'SDWAN',
    lifeCycleStatus: 'OPERATING',
    hostname: 'manage.flexiwan.com',
    ipAddress: '',
    port: '443',
    status: 'UP',
  },
  {
    id: 'ri-switch-ssh-22',
    name: 'SWITCH_SSH',
    publicIdentifier: 'SWITCH_SSH',
    specification: 'SWITCH',
    lifeCycleStatus: 'OPERATING',
    hostname: '',
    ipAddress: '172.20.8.60',
    port: '22',
    status: 'UP',
  },
  {
    id: 'ri-switch-ssh-161',
    name: 'SWITCH_SSH',
    publicIdentifier: 'SWITCH_SSH',
    specification: 'SWITCH',
    lifeCycleStatus: 'OPERATING',
    hostname: '',
    ipAddress: '172.20.8.60',
    port: '161',
    status: 'UNKNOWN',
  },
  {
    id: 'ri-nap-apodaca',
    name: 'NAP_REGION_APODACA',
    publicIdentifier: 'NAP_REGION_APODACA',
    specification: 'NAP',
    lifeCycleStatus: 'OPERATING',
    hostname: '',
    ipAddress: '172.17.0.1',
    port: '8030',
    status: 'DOWN',
  },
  {
    id: 'ri-test-mock',
    name: 'TEST_MOCK',
    publicIdentifier: 'TEST_MOCK',
    specification: 'NAP',
    lifeCycleStatus: 'OPERATING',
    hostname: '',
    ipAddress: '12.0.56.53',
    port: '8030',
    status: 'DOWN',
  },
  {
    id: 'ri-spotify',
    name: 'SPOTIFY',
    publicIdentifier: 'SPOTIFY',
    specification: 'AUDIO_OTT',
    lifeCycleStatus: 'OPERATING',
    hostname: 'api.spotify.com',
    ipAddress: '',
    port: '443',
    status: 'DOWN',
  },
  {
    id: 'ri-telegram',
    name: 'TELEGRAM',
    publicIdentifier: 'TELEGRAM',
    specification: 'INSTANT_MESSENGER_OTT',
    lifeCycleStatus: 'OPERATING',
    hostname: 'api.telegram.org',
    ipAddress: '',
    port: '443',
    status: 'DOWN',
  },
  {
    id: 'ri-salesforce',
    name: 'SALESFORCE',
    publicIdentifier: 'SALESFORCE',
    specification: 'CRM',
    lifeCycleStatus: 'OPERATING',
    hostname: 'intraway.my.salesforce.com',
    ipAddress: '',
    port: '443',
    status: 'UP',
  },
  {
    id: 'ri-symphonica',
    name: 'SYMPHONICA',
    publicIdentifier: 'SYMPHONICA',
    specification: 'SOM',
    lifeCycleStatus: 'OPERATING',
    hostname: 'sym-demo.iway-qa-0.symphonica.com',
    ipAddress: '',
    port: '443',
    status: 'UP',
  },
  {
    id: 'ri-zabbix',
    name: 'ZABBIX_NMS',
    publicIdentifier: 'ZABBIX_NMS',
    specification: 'NMS',
    lifeCycleStatus: 'OPERATING',
    hostname: 'zabbix.intraway.com',
    ipAddress: '172.20.4.10',
    port: '10051',
    status: 'UP',
  },
]

export const RESOURCE_INVENTORY_REGIONS = ['All regions', 'LATAM', 'EMEA', 'NA'] as const

export const RESOURCE_INVENTORY_SPECIFICATIONS = [
  'All specifications',
  'SDWAN',
  'SWITCH',
  'NAP',
  'AUDIO_OTT',
  'INSTANT_MESSENGER_OTT',
  'CRM',
  'SOM',
  'NMS',
] as const

export const RESOURCE_INVENTORY_NMS = ['All NMS', 'ZABBIX', 'PRTG', 'None'] as const

/** Toggleable data columns for sym-table settings (`more_horiz`) — Figma Resource Inventory. */
export const RESOURCE_INVENTORY_TABLE_COLUMNS = [
  { id: 'name', label: 'Name', defaultVisible: true },
  { id: 'publicIdentifier', label: 'Public Identifier', defaultVisible: true },
  { id: 'specification', label: 'Specification', defaultVisible: true },
  { id: 'lifeCycleStatus', label: 'Life Cycle Status', defaultVisible: true },
  { id: 'hostname', label: 'Hostname', defaultVisible: true },
  { id: 'ipAddress', label: 'IP Address', defaultVisible: true },
  { id: 'port', label: 'Port', defaultVisible: true },
  { id: 'customerId', label: 'Customer Id', defaultVisible: false },
  { id: 'connection', label: 'Connection', defaultVisible: false },
  { id: 'category', label: 'Category', defaultVisible: false },
] as const

/** Always visible; pinned immediately before Actions — not in column settings popover. */
export const RESOURCE_INVENTORY_STATUS_COLUMN = {
  id: 'status',
  label: 'Status',
} as const

export type ResourceInventoryToggleableColumnId =
  (typeof RESOURCE_INVENTORY_TABLE_COLUMNS)[number]['id']

export type ResourceInventoryColumnId =
  | ResourceInventoryToggleableColumnId
  | typeof RESOURCE_INVENTORY_STATUS_COLUMN.id
