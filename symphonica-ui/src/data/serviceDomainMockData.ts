export const SERVICE_SPEC_VALUE_TYPES = ['STRING', 'NUMBER', 'BOOLEAN', 'OBJECT'] as const

export type ServiceSpecValueType = (typeof SERVICE_SPEC_VALUE_TYPES)[number]

/** Service Domain POC — Figma SYM Service Specification 968:45029 (Characteristics step). */
export type ServiceSpecCharacteristic = {
  id: string
  name: string
  description: string
  valueType: ServiceSpecValueType
  configurable: boolean
  mutable: boolean
  unique: boolean
  subCharacteristics: boolean
  minCardinality: number
  maxCardinality: number
  /** ISO date (yyyy-mm-dd) for drawer date pickers — Figma 973:47114 */
  validFrom: string
  validTo: string
}

export const NEW_CHARACTERISTIC_ID = '__new__'

export function createEmptyServiceSpecCharacteristic(): ServiceSpecCharacteristic {
  return {
    id: NEW_CHARACTERISTIC_ID,
    name: '',
    description: '',
    valueType: 'STRING',
    configurable: false,
    mutable: false,
    unique: false,
    subCharacteristics: false,
    minCardinality: 0,
    maxCardinality: 0,
    validFrom: '',
    validTo: '',
  }
}

export const SERVICE_SPEC_CHARACTERISTICS: ServiceSpecCharacteristic[] = [
  {
    id: 'speed',
    name: 'Speed',
    description: 'Speed',
    valueType: 'STRING',
    configurable: true,
    mutable: true,
    unique: false,
    subCharacteristics: false,
    minCardinality: 0,
    maxCardinality: 1,
    validFrom: '2026-06-24',
    validTo: '',
  },
  {
    id: 'interface',
    name: 'INTERFACE',
    description: 'Interface',
    valueType: 'STRING',
    configurable: true,
    mutable: true,
    unique: false,
    subCharacteristics: true,
    minCardinality: 0,
    maxCardinality: 1,
    validFrom: '2026-06-24',
    validTo: '',
  },
  {
    id: 'site-name',
    name: 'SITE_NAME',
    description: 'Site name',
    valueType: 'STRING',
    configurable: true,
    mutable: true,
    unique: false,
    subCharacteristics: false,
    minCardinality: 0,
    maxCardinality: 1,
    validFrom: '2026-06-24',
    validTo: '',
  },
]

export const SERVICE_SPEC_PILL_LABELS = [
  '1. Specification',
  '2. Characteristics',
  '3. Service Relationships',
  '4. Supporting Actions',
] as const

export const CHARACTERISTIC_VALUE_RANGE_INTERVALS = [
  'Open',
  'Closed',
  'Closed Bottom',
  'Closed Top',
] as const

export type CharacteristicValueRangeInterval =
  (typeof CHARACTERISTIC_VALUE_RANGE_INTERVALS)[number]

/** Characteristic value row — Figma 976:47872 (Values drawer) + 980:49053 (Add Value form). */
export type CharacteristicValue = {
  id: string
  value: string
  unitOfMeasure: string
  description: string
  validForStart: string
  validForEnd: string
  valueFrom: string
  valueTo: string
  regex: string
  rangeInterval: CharacteristicValueRangeInterval | ''
  isDefault: boolean
}

export const CHARACTERISTIC_VALUES_BY_ID: Record<string, CharacteristicValue[]> = {
  speed: [
    {
      id: 'speed-v1',
      value: '108',
      unitOfMeasure: 'mhz',
      description: '',
      validForStart: '25/03/2026',
      validForEnd: '',
      valueFrom: '',
      valueTo: '',
      regex: '',
      rangeInterval: '',
      isDefault: false,
    },
    {
      id: 'speed-v2',
      value: '36.00',
      unitOfMeasure: 'Celsius',
      description: '',
      validForStart: '25/03/2026',
      validForEnd: '',
      valueFrom: '',
      valueTo: '',
      regex: '',
      rangeInterval: '',
      isDefault: false,
    },
    {
      id: 'speed-v3',
      value: '24',
      unitOfMeasure: 'inches',
      description: '',
      validForStart: '25/03/2026',
      validForEnd: '',
      valueFrom: '',
      valueTo: '',
      regex: '',
      rangeInterval: '',
      isDefault: false,
    },
  ],
  interface: [],
  'site-name': [],
}
