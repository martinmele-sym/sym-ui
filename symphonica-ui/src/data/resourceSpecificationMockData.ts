export type ResourceSpecificationLifeCycleStatus =
  | 'IN_TEST'
  | 'ACTIVE'
  | 'LAUNCHED'
  | 'RETIRED'

export type ResourceSpecificationRow = {
  id: string
  code: string
  version: string
  name: string
  baseType: string
  description: string
  startDate: string
  endDate: string
  lifeCycleStatus: ResourceSpecificationLifeCycleStatus
  creationDate: string
  lastDate: string
  nms: string
}

export const RESOURCE_SPECIFICATION_TOTAL = 140

export const RESOURCE_SPECIFICATION_NMS = ['', 'ZABBIX', 'PRTG', 'None'] as const

const SEED_ROWS: Omit<ResourceSpecificationRow, 'id'>[] = [
  {
    code: 'GPON_NMS',
    version: '1.0',
    name: 'GPON NMS',
    baseType: 'NMS',
    description: 'The gpon NMS ddd',
    startDate: '6/22/2020',
    endDate: '',
    lifeCycleStatus: 'IN_TEST',
    creationDate: '6/22/2020',
    lastDate: '',
    nms: 'ZABBIX',
  },
  {
    code: 'SDWAN_EDGE',
    version: '2.1',
    name: 'SDWAN Edge',
    baseType: 'SDWAN',
    description: 'Edge appliance specification',
    startDate: '3/15/2021',
    endDate: '',
    lifeCycleStatus: 'ACTIVE',
    creationDate: '3/15/2021',
    lastDate: '1/10/2024',
    nms: 'PRTG',
  },
  {
    code: 'SWITCH_CORE',
    version: '1.4',
    name: 'Core Switch',
    baseType: 'SWITCH',
    description: 'Core layer switch profile',
    startDate: '8/1/2019',
    endDate: '',
    lifeCycleStatus: 'LAUNCHED',
    creationDate: '8/1/2019',
    lastDate: '11/2/2023',
    nms: 'None',
  },
  {
    code: 'NAP_FIBER',
    version: '1.0',
    name: 'NAP Fiber',
    baseType: 'NAP',
    description: 'Fiber NAP specification',
    startDate: '2/5/2022',
    endDate: '',
    lifeCycleStatus: 'IN_TEST',
    creationDate: '2/5/2022',
    lastDate: '',
    nms: 'ZABBIX',
  },
  {
    code: 'AUDIO_OTT',
    version: '3.0',
    name: 'Audio OTT',
    baseType: 'AUDIO_OTT',
    description: 'Streaming audio resource',
    startDate: '5/20/2020',
    endDate: '12/31/2025',
    lifeCycleStatus: 'ACTIVE',
    creationDate: '5/20/2020',
    lastDate: '6/1/2024',
    nms: 'None',
  },
  {
    code: 'CRM_HUB',
    version: '1.2',
    name: 'CRM Hub',
    baseType: 'CRM',
    description: 'CRM integration spec',
    startDate: '9/9/2018',
    endDate: '',
    lifeCycleStatus: 'LAUNCHED',
    creationDate: '9/9/2018',
    lastDate: '4/18/2024',
    nms: 'PRTG',
  },
  {
    code: 'SOM_ORCH',
    version: '2.0',
    name: 'SOM Orchestrator',
    baseType: 'SOM',
    description: 'Service order orchestration',
    startDate: '1/12/2023',
    endDate: '',
    lifeCycleStatus: 'IN_TEST',
    creationDate: '1/12/2023',
    lastDate: '',
    nms: 'ZABBIX',
  },
  {
    code: 'NMS_GATE',
    version: '1.1',
    name: 'NMS Gateway',
    baseType: 'NMS',
    description: 'Gateway NMS profile',
    startDate: '7/7/2017',
    endDate: '',
    lifeCycleStatus: 'RETIRED',
    creationDate: '7/7/2017',
    lastDate: '2/28/2022',
    nms: 'None',
  },
]

export function buildResourceSpecificationCatalog(
  total: number = RESOURCE_SPECIFICATION_TOTAL,
): ResourceSpecificationRow[] {
  return Array.from({ length: total }, (_, index) => {
    const seed = SEED_ROWS[index % SEED_ROWS.length]
    const suffix = index >= SEED_ROWS.length ? `_${index + 1}` : ''
    return {
      ...seed,
      id: `${seed.code}${suffix}`,
      code: index >= SEED_ROWS.length ? `${seed.code}${suffix}` : seed.code,
      name: index >= SEED_ROWS.length ? `${seed.name} ${index + 1}` : seed.name,
    }
  })
}
