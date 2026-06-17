import type { AppData, Property, Building, Business } from "./types"

const STORAGE_KEY = "get-tax-savvy-data-v3"
const OLD_KEYS = ["get-tax-savvy-data-v2", "get-tax-savvy-data-v1"]

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function makeBuilding(partial: Partial<Building>): Building {
  return {
    id: makeId(),
    label: "Building",
    purchasePrice: 0,
    purchaseDate: "",
    placedInServiceDate: "",
    ...partial,
  }
}

function makeProperty(partial: Partial<Property>): Property {
  return {
    id: makeId(),
    name: "Property",
    ownership: "LLC",
    theme: { border: "#6b7280", bg: "#1f2937" },
    buildingId: "",
    depreciationShare: 100,
    status: "Vacant",
    monthlyRent: 0,
    tenantName: "",
    moveInDate: "",
    leaseEndDate: "",
    monthToMonth: false,
    income: [],
    expenses: [],
    ...partial,
  }
}

export function getDefaultData(): AppData {
  // One building per purchase. Elmwood is a single duplex purchase shared by 2 cards.
  const elmwood = makeBuilding({ label: "220 Elmwood Ave (duplex)" })
  const fourth = makeBuilding({ label: "146 W Fourth St" })
  const orchard = makeBuilding({ label: "114 Orchard St" })

  const buildings: Building[] = [fourth, elmwood, orchard]

  const properties: Property[] = [
    makeProperty({
      name: "146 W Fourth St",
      ownership: "LLC",
      theme: { border: "#22c55e", bg: "#14532d" },
      buildingId: fourth.id,
      depreciationShare: 100,
      status: "Rented",
      monthToMonth: true,
    }),
    makeProperty({
      name: "220 Elmwood Ave - Unit A",
      ownership: "LLC",
      theme: { border: "#3b82f6", bg: "#1e3a8a" },
      buildingId: elmwood.id,
      depreciationShare: 50,
      status: "Rented",
      monthlyRent: 1400,
    }),
    makeProperty({
      name: "220 Elmwood Ave - Unit B",
      ownership: "LLC",
      theme: { border: "#a855f7", bg: "#581c87" },
      buildingId: elmwood.id,
      depreciationShare: 50,
      status: "Rented",
      monthlyRent: 1100,
      monthToMonth: true,
    }),
    makeProperty({
      name: "114 Orchard St",
      ownership: "Personal",
      theme: { border: "#6b7280", bg: "#1f2937" },
      buildingId: orchard.id,
      depreciationShare: 100,
      status: "Vacant",
    }),
  ]

  const businesses: Business[] = [
    { id: makeId(), name: "Basketball Officiating", income: [], mileage: [] },
  ]

  return { buildings, properties, businesses, billingEnabled: false }
}

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (!parsed.properties || !parsed.businesses || !parsed.buildings) return getDefaultData()
      if (typeof parsed.billingEnabled !== "boolean") parsed.billingEnabled = false
      return ensureIntegrity(parsed)
    }
    const migrated = migrateOld()
    if (migrated) {
      saveData(migrated)
      return migrated
    }
    return getDefaultData()
  } catch {
    return getDefaultData()
  }
}

// Make sure every property points at a real building.
function ensureIntegrity(data: AppData): AppData {
  const ids = new Set(data.buildings.map((b) => b.id))
  for (const p of data.properties) {
    if (!p.buildingId || !ids.has(p.buildingId)) {
      const b = makeBuilding({ label: p.name })
      data.buildings.push(b)
      ids.add(b.id)
      p.buildingId = b.id
      if (!p.depreciationShare) p.depreciationShare = 100
    }
  }
  return data
}

// Migrate from older single-array schemas (v1 = flat cards, v2 = units-in-card).
function migrateOld(): AppData | null {
  try {
    let raw: string | null = null
    for (const k of OLD_KEYS) {
      raw = window.localStorage.getItem(k)
      if (raw) break
    }
    if (!raw) return null
    const old = JSON.parse(raw)
    if (!old?.properties) return null

    const buildings: Building[] = []
    const properties: Property[] = []
    let elmwoodBuilding: Building | null = null

    for (const p of old.properties as any[]) {
      const name: string = p.name || "Property"
      const isElmwood = name.toLowerCase().includes("elmwood")

      // v2 stored units inside a property; flatten each unit back to its own card.
      const units: any[] = Array.isArray(p.units) && p.units.length ? p.units : [null]

      units.forEach((u: any, idx: number) => {
        const unitLabel = u?.label && u.label !== "Main" ? ` - ${u.label}` : ""
        const cardName = isElmwood && u?.label ? `220 Elmwood Ave - ${u.label}` : `${name}${unitLabel}`

        // Building: Elmwood shares one; everyone else gets their own.
        let building: Building
        if (isElmwood) {
          if (!elmwoodBuilding) {
            elmwoodBuilding = makeBuilding({
              label: "220 Elmwood Ave (duplex)",
              purchasePrice: p.purchasePrice || 0,
              purchaseDate: p.purchaseDate || "",
              placedInServiceDate: p.placedInServiceDate || "",
            })
            buildings.push(elmwoodBuilding)
          }
          building = elmwoodBuilding
        } else {
          building = makeBuilding({
            label: name,
            purchasePrice: p.purchasePrice || 0,
            purchaseDate: p.purchaseDate || "",
            placedInServiceDate: p.placedInServiceDate || "",
          })
          buildings.push(building)
        }

        const unitId = u?.id
        const income = (p.income || [])
          .filter((e: any) => (unitId ? e.unitId === unitId || (!e.unitId && idx === 0) : true))
          .map((e: any) => ({ id: e.id || makeId(), date: e.date || "", source: e.source || "", amount: e.amount || 0, notes: e.notes || "" }))
        const expenses = (p.expenses || [])
          .filter((e: any) => (unitId ? e.unitId === unitId || (!e.unitId && idx === 0) : true))
          .map((e: any) => ({ id: e.id || makeId(), date: e.date || "", category: e.category || "Other", amount: e.amount || 0, notes: e.notes || "", receiptName: e.receiptName, receiptData: e.receiptData }))

        properties.push(
          makeProperty({
            name: cardName,
            ownership: p.ownership || (u?.label ? "LLC" : "LLC"),
            theme: u?.accent
              ? { border: u.accent, bg: p.theme?.bg || "#1f2937" }
              : p.theme || { border: "#6b7280", bg: "#1f2937" },
            buildingId: building.id,
            depreciationShare: isElmwood ? 50 : 100,
            status: u?.status || p.status || "Vacant",
            monthlyRent: u?.monthlyRent ?? p.monthlyRent ?? 0,
            tenantName: u?.tenantName || "",
            moveInDate: u?.moveInDate || "",
            leaseEndDate: u?.leaseEndDate || "",
            monthToMonth: !!u?.monthToMonth,
            leaseName: u?.leaseName,
            leaseData: u?.leaseData,
            income,
            expenses,
          }),
        )
      })
    }

    return {
      buildings,
      properties,
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

export { makeId, makeBuilding, makeProperty }
