export type PropertyTheme = {
  border: string
  bg: string
}

export type IncomeEntry = {
  id: string
  date: string
  source: string
  amount: number
  notes: string
  unitId?: string // which rental unit this income belongs to
}

export type ExpenseEntry = {
  id: string
  date: string
  category: string
  amount: number
  notes: string
  receiptName?: string
  receiptData?: string // base64 data URL
  unitId?: string // optional: blank = shared/whole-property expense
}

export type Unit = {
  id: string
  label: string // e.g. "Unit A", "Unit B", "Main"
  accent: string // small color dot to tell units apart
  status: "Rented" | "Vacant"
  monthlyRent: number
  tenantName: string
  moveInDate: string
  leaseEndDate: string // blank when month-to-month
  monthToMonth: boolean
  leaseName?: string
  leaseData?: string // base64 data URL of uploaded lease
}

export type Property = {
  id: string
  name: string
  ownership: "LLC" | "Personal"
  theme: PropertyTheme
  // Shared, behind-the-scenes tax basis (one set per building, even a duplex)
  purchasePrice: number
  purchaseDate: string // when the property was bought
  placedInServiceDate: string // when it actually started being rented out
  units: Unit[]
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
}

export type MileageEntry = {
  id: string
  date: string
  description: string
  miles: number
}

export type BusinessIncomeEntry = {
  id: string
  date: string
  source: string
  amount: number
  notes: string
}

export type Business = {
  id: string
  name: string
  income: BusinessIncomeEntry[]
  mileage: MileageEntry[]
}

export type AppData = {
  properties: Property[]
  businesses: Business[]
  billingEnabled: boolean
}

export const MILEAGE_RATE = 0.7
export const DEPRECIATION_YEARS = 27.5
export const DEPRECIATION_LAND_FACTOR = 0.8
