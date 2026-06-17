import {
  type Property,
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

export function annualDepreciation(property: Property): number {
  if (!property.purchasePrice || property.purchasePrice <= 0) return 0
  // No depreciation can be claimed before the property was placed in service (rented out).
  if (!property.placedInServiceDate) return 0
  return (property.purchasePrice * DEPRECIATION_LAND_FACTOR) / DEPRECIATION_YEARS
}

// Depreciation needs review when basis exists but there's no rental-start date,
// or the rental start is much later than the purchase (e.g. lived in it first).
export function depreciationNeedsReview(property: Property): boolean {
  if (!property.purchasePrice || property.purchasePrice <= 0) return false
  if (!property.placedInServiceDate) return true
  if (property.purchaseDate && property.placedInServiceDate) {
    const bought = new Date(property.purchaseDate).getTime()
    const placed = new Date(property.placedInServiceDate).getTime()
    // More than ~1 year gap between buying and renting out
    if (placed - bought > 366 * 24 * 60 * 60 * 1000) return true
  }
  return false
}

export function netIncome(property: Property): number {
  return totalIncome(property) - totalExpenses(property) - annualDepreciation(property)
}

export function unitIncome(property: Property, unitId: string): number {
  return property.income
    .filter((e) => e.unitId === unitId)
    .reduce((s, e) => s + (Number(e.amount) || 0), 0)
}

export function unitExpenses(property: Property, unitId: string): number {
  return property.expenses
    .filter((e) => e.unitId === unitId)
    .reduce((s, e) => s + (Number(e.amount) || 0), 0)
}

export function sharedExpenses(property: Property): number {
  return property.expenses
    .filter((e) => !e.unitId)
    .reduce((s, e) => s + (Number(e.amount) || 0), 0)
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
