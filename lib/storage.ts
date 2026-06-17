import type { AppData, Property, Business } from "./types"

const STORAGE_KEY = "get-tax-savvy-data-v1"

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function getDefaultData(): AppData {
  const properties: Property[] = [
    {
      id: makeId(),
      name: "146 W Fourth St",
      ownership: "LLC",
      status: "Rented",
      monthlyRent: 0,
      purchasePrice: 0,
      purchaseDate: "",
      theme: { border: "#22c55e", bg: "#14532d" },
      income: [],
      expenses: [],
    },
    {
      id: makeId(),
      name: "220 Elmwood Ave Unit A",
      ownership: "LLC",
      status: "Rented",
      monthlyRent: 1400,
      purchasePrice: 0,
      purchaseDate: "",
      theme: { border: "#3b82f6", bg: "#1e3a8a" },
      income: [],
      expenses: [],
    },
    {
      id: makeId(),
      name: "220 Elmwood Ave Unit B",
      ownership: "LLC",
      status: "Rented",
      monthlyRent: 1100,
      purchasePrice: 0,
      purchaseDate: "",
      theme: { border: "#a855f7", bg: "#581c87" },
      income: [],
      expenses: [],
    },
    {
      id: makeId(),
      name: "114 Orchard St",
      ownership: "Personal",
      status: "Vacant",
      monthlyRent: 0,
      purchasePrice: 0,
      purchaseDate: "",
      theme: { border: "#6b7280", bg: "#1f2937" },
      income: [],
      expenses: [],
    },
  ]

  const businesses: Business[] = [
    {
      id: makeId(),
      name: "Basketball Officiating",
      income: [],
      mileage: [],
    },
  ]

  return { properties, businesses, billingEnabled: false }
}

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultData()
    const parsed = JSON.parse(raw) as AppData
    // basic shape guard
    if (!parsed.properties || !parsed.businesses) return getDefaultData()
    if (typeof parsed.billingEnabled !== "boolean") parsed.billingEnabled = false
    return parsed
  } catch {
    return getDefaultData()
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.log("[v0] Failed to save data:", (err as Error).message)
  }
}

export { makeId }
