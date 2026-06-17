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
  return (property.purchasePrice * DEPRECIATION_LAND_FACTOR) / DEPRECIATION_YEARS
}

export function netIncome(property: Property): number {
  return totalIncome(property) - totalExpenses(property) - annualDepreciation(property)
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
