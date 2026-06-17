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
}

export type ExpenseEntry = {
  id: string
  date: string
  category: string
  amount: number
  notes: string
  receiptName?: string
  receiptData?: string // base64 data URL
}

export type Property = {
  id: string
  name: string
  ownership: "LLC" | "Personal"
  status: "Rented" | "Vacant"
  monthlyRent: number
  purchasePrice: number
  purchaseDate: string
  theme: PropertyTheme
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
