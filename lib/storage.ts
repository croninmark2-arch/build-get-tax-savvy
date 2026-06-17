import type { AppData, Property, Business, Unit } from "./types"

const STORAGE_KEY = "get-tax-savvy-data-v2"
const OLD_STORAGE_KEY = "get-tax-savvy-data-v1"

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function makeUnit(partial: Partial<Unit>): Unit {
  return {
    id: makeId(),
    label: "Main",
    accent: "#94a3b8",
    status: "Vacant",
    monthlyRent: 0,
    tenantName: "",
    moveInDate: "",
    leaseEndDate: "",
    monthToMonth: false,
    ...partial,
  }
}

export function getDefaultData(): AppData {
  const properties: Property[] = [
    {
      id: makeId(),
      name: "146 W Fourth St",
      ownership: "LLC",
      theme: { border: "#22c55e", bg: "#14532d" },
      purchasePrice: 0,
      purchaseDate: "",
      placedInServiceDate: "",
      units: [
        makeUnit({
          label: "Main",
          accent: "#22c55e",
          status: "Rented",
          monthToMonth: true,
        }),
      ],
      income: [],
      expenses: [],
    },
    {
      // The Elmwood duplex: ONE building, TWO rental units (A + B)
      id: makeId(),
      name: "220 Elmwood Ave",
      ownership: "LLC",
      theme: { border: "#3b82f6", bg: "#1e3a8a" },
      purchasePrice: 0,
      purchaseDate: "",
      placedInServiceDate: "",
      units: [
        makeUnit({
          label: "Unit A",
          accent: "#3b82f6",
          status: "Rented",
          monthlyRent: 1400,
        }),
        makeUnit({
          label: "Unit B",
          accent: "#a855f7",
          status: "Rented",
          monthlyRent: 1100,
          monthToMonth: true,
        }),
      ],
      income: [],
      expenses: [],
    },
    {
      id: makeId(),
      name: "114 Orchard St",
      ownership: "Personal",
      theme: { border: "#6b7280", bg: "#1f2937" },
      purchasePrice: 0,
      purchaseDate: "",
      placedInServiceDate: "",
      units: [
        makeUnit({
          label: "Main",
          accent: "#6b7280",
          status: "Vacant",
        }),
      ],
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
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (!parsed.properties || !parsed.businesses) return getDefaultData()
      if (typeof parsed.billingEnabled !== "boolean") parsed.billingEnabled = false
      // ensure every property has at least one unit
      for (const p of parsed.properties) {
        if (!p.units || p.units.length === 0) {
          p.units = [makeUnit({ label: "Main", accent: p.theme?.border || "#94a3b8" })]
        }
      }
      return parsed
    }
    // Try migrating from the old v1 schema
    const migrated = migrateFromV1()
    if (migrated) {
      saveData(migrated)
      return migrated
    }
    return getDefaultData()
  } catch {
    return getDefaultData()
  }
}

// v1 stored Elmwood as two separate cards (Unit A + Unit B). Combine them.
function migrateFromV1(): AppData | null {
  try {
    const oldRaw = window.localStorage.getItem(OLD_STORAGE_KEY)
    if (!oldRaw) return null
    const old = JSON.parse(oldRaw)
    if (!old?.properties) return null

    const out: Property[] = []
    let elmwood: Property | null = null

    for (const p of old.properties as any[]) {
      const isElmwood = typeof p.name === "string" && p.name.toLowerCase().includes("elmwood")
      const unitLabel =
        /unit\s*a/i.test(p.name) ? "Unit A" : /unit\s*b/i.test(p.name) ? "Unit B" : "Main"

      const unit = makeUnit({
        label: unitLabel,
        accent: p.theme?.border || "#94a3b8",
        status: p.status || "Vacant",
        monthlyRent: p.monthlyRent || 0,
      })

      const incomeWithUnit = (p.income || []).map((e: any) => ({ ...e, unitId: unit.id }))
      const expensesWithUnit = (p.expenses || []).map((e: any) => ({ ...e, unitId: unit.id }))

      if (isElmwood) {
        if (!elmwood) {
          elmwood = {
            id: makeId(),
            name: "220 Elmwood Ave",
            ownership: p.ownership || "LLC",
            theme: { border: "#3b82f6", bg: "#1e3a8a" },
            purchasePrice: p.purchasePrice || 0,
            purchaseDate: p.purchaseDate || "",
            placedInServiceDate: "",
            units: [unit],
            income: incomeWithUnit,
            expenses: expensesWithUnit,
          }
          out.push(elmwood)
        } else {
          elmwood.units.push(unit)
          elmwood.income.push(...incomeWithUnit)
          elmwood.expenses.push(...expensesWithUnit)
          if (!elmwood.purchasePrice && p.purchasePrice) elmwood.purchasePrice = p.purchasePrice
        }
      } else {
        out.push({
          id: makeId(),
          name: p.name,
          ownership: p.ownership || "LLC",
          theme: p.theme || { border: "#6b7280", bg: "#1f2937" },
          purchasePrice: p.purchasePrice || 0,
          purchaseDate: p.purchaseDate || "",
          placedInServiceDate: "",
          units: [unit],
          income: incomeWithUnit,
          expenses: expensesWithUnit,
        })
      }
    }

    return {
      properties: out,
      businesses: old.businesses || [],
      billingEnabled: !!old.billingEnabled,
    }
  } catch {
    return null
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

export { makeId, makeUnit }
