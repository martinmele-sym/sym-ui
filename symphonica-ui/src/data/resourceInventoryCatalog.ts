import {
  RESOURCE_INVENTORY_ROWS,
  RESOURCE_INVENTORY_TOTAL,
  type ResourceInventoryRow,
} from './resourceInventoryMockData'

/** Simulated full catalog for progressive load POC (152 items). */
export function buildResourceInventoryCatalog(
  total: number = RESOURCE_INVENTORY_TOTAL,
): ResourceInventoryRow[] {
  const seeds = RESOURCE_INVENTORY_ROWS
  if (seeds.length === 0) return []

  return Array.from({ length: total }, (_, index) => {
    const seed = seeds[index % seeds.length]
    const suffix = index >= seeds.length ? `-${index + 1}` : ''
    return {
      ...seed,
      id: `${seed.id}${suffix}`,
      name: index >= seeds.length ? `${seed.name} ${index + 1}` : seed.name,
      publicIdentifier:
        index >= seeds.length ? `${seed.publicIdentifier}-${index + 1}` : seed.publicIdentifier,
    }
  })
}

export function sliceResourceInventoryCatalog(
  catalog: ResourceInventoryRow[],
  visibleCount: number,
): ResourceInventoryRow[] {
  return catalog.slice(0, Math.min(visibleCount, catalog.length))
}
