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

// A physical building / single purchase. A duplex is ONE building even though
// it shows up as two property cards (Unit A + Unit B). The purchase basis and
// depreciation live here so they are entered once and never double-counted.
export type Building = {
  id: string
  label: string // e.g. "220 Elmwood Ave (duplex)"
  purchasePrice: number
  purchaseDate: string // when the building was bought
  placedInServiceDate: string // when it actually started being rented out
}

export type Property = {
  id: string
  name: string
  ownership: "LLC" | "Personal"
  theme: PropertyTheme
  buildingId: string // links to the shared Building that holds the purchase basis
  depreciationShare: number // percent (0-100) of the building's depreciation allocated to this card
  // Tenant / lease — one tenant per card
  status: "Rented" | "Vacant"
  monthlyRent: number
  tenantName: string
  moveInDate: string
  leaseEndDate: string // blank when month-to-month
  monthToMonth: boolean
  leaseName?: string
  leaseData?: string // base64 data URL of uploaded lease
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
  buildings: Building[]
  properties: Property[]
  businesses: Business[]
  billingEnabled: boolean
}

export const MILEAGE_RATE = 0.7
export const DEPRECIATION_YEARS = 27.5
export const DEPRECIATION_LAND_FACTOR = 0.8
