export const ORDER_TYPE_OPTIONS = [
  'ACTIVATE',
  'CHANGE',
  'CHANGE_EQUIPMENT',
  'CHANGE_OWNER',
  'CHANGE_RESOURCE',
  'CHANGE_SERVICE',
] as const

export type OrderType = (typeof ORDER_TYPE_OPTIONS)[number]
