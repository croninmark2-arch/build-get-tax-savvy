import {
  type Property,
  type Building,
  type Business,
  DEPRECIATION_YEARS,
  DEPRECIATION_LAND_FACTOR,
  MILEAGE_RATE,
} from "./types"

export function totalIncome(property: Property): number {
  return property.income.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

export function totalExpenses(property: Property): number {
  return property.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

// Depreciation for the WHOLE building (entered once per purchase).
export function buildingDepreciation(building?: Building): number {
  if (!building || !building.purchasePrice || building.purchasePrice <= 0) return 0
  // No depreciation can be claimed before the building was placed in service (rented out).
  if (!building.placedInServiceDate) return 0
  return (building.purchasePrice * DEPRECIATION_LAND_FACTOR) / DEPRECIATION_YEARS
}

// The slice of building depreciation allocated to this particular card.
export function annualDepreciation(property: Property, building?: Building): number {
  const total = buildingDepreciation(building)
  if (total === 0) return 0
  const share = typeof property.depreciationShare === "number" ? property.depreciationShare : 100
  return (total * share) / 100
}

// Depreciation needs review when basis exists but there's no rental-start date,
// or the rental start is much later than the purchase (e.g. lived in it first).
export function depreciationNeedsReview(building?: Building): boolean {
  if (!building || !building.purchasePrice || building.purchasePrice <= 0) return false
  if (!building.placedInServiceDate) return true
  if (building.purchaseDate && building.placedInServiceDate) {
    const bought = new Date(building.purchaseDate).getTime()
    const placed = new Date(building.placedInServiceDate).getTime()
    // More than ~1 year gap between buying and renting out
    if (placed - bought > 366 * 24 * 60 * 60 * 1000) return true
  }
  return false
}

export function netIncome(property: Property, building?: Building): number {
  return totalIncome(property) - totalExpenses(property) - annualDepreciation(property, building)
}

// Group expenses by category for Schedule E
export function expensesByCategory(property: Property): Record<string, number> {
  const result: Record<string, number> = {}
  for (const e of property.expenses) {
    const cat = e.category || "Other"
    result[cat] = (result[cat] || 0) + (Number(e.amount) || 0)
  }
  return result
}

export function businessTotalIncome(business: Business): number {
  return business.income.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
}

export function businessTotalMiles(business: Business): number {
  return business.mileage.reduce((sum, m) => sum + (Number(m.miles) || 0), 0)
}

export function businessMileageDeduction(business: Business): number {
  return businessTotalMiles(business) * MILEAGE_RATE
}

export function businessNet(business: Business): number {
  return businessTotalIncome(business) - businessMileageDeduction(business)
}
