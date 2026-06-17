import { type AppData, type Property, type Building, type Business, MILEAGE_RATE } from "./types"
import {
  totalIncome,
  totalExpenses,
  annualDepreciation,
  netIncome,
  expensesByCategory,
  businessTotalIncome,
  businessTotalMiles,
  businessMileageDeduction,
  businessNet,
} from "./tax-math"

function csvEscape(value: string | number): string {
  const s = String(value ?? "")
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function rowsToCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\r\n")
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function safeName(name: string): string {
  return name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "")
}

// 1. Export to CSV — Income + Expenses combined
export function exportPropertyCsv(property: Property, building?: Building) {
  const rows: (string | number)[][] = []
  rows.push([`Get Tax Savvy — ${property.name}`])
  rows.push([`Ownership: ${property.ownership}`, `Status: ${property.status}`])
  rows.push([
    `Tenant: ${property.tenantName || "—"}`,
    `Move-in: ${property.moveInDate || "—"}`,
    `Lease: ${property.monthToMonth ? "Month-to-month" : property.leaseEndDate || "—"}`,
    `Lease file: ${property.leaseName || "—"}`,
  ])
  rows.push([])
  rows.push(["INCOME"])
  rows.push(["Date", "Source", "Amount", "Notes"])
  for (const e of property.income) {
    rows.push([e.date, e.source, e.amount.toFixed(2), e.notes])
  }
  rows.push(["", "Total Income", totalIncome(property).toFixed(2)])
  rows.push([])
  rows.push(["EXPENSES"])
  rows.push(["Date", "Category", "Amount", "Notes", "Receipt"])
  for (const e of property.expenses) {
    rows.push([e.date, e.category, e.amount.toFixed(2), e.notes, e.receiptName || ""])
  }
  rows.push(["", "Total Expenses", totalExpenses(property).toFixed(2)])
  rows.push([])
  if (building) {
    rows.push(["Building", building.label])
    rows.push(["Purchase Price (whole building)", building.purchasePrice.toFixed(2)])
    rows.push(["Date Purchased", building.purchaseDate])
    rows.push(["Date First Rented (placed in service)", building.placedInServiceDate])
    rows.push([`Depreciation share for this card (%)`, String(property.depreciationShare ?? 100)])
  }
  rows.push(["Annual Depreciation (estimate — confirm with CPA)", annualDepreciation(property, building).toFixed(2)])
  rows.push(["Net Income", netIncome(property, building).toFixed(2)])

  triggerDownload(rowsToCsv(rows), `${safeName(property.name)}_data.csv`, "text/csv;charset=utf-8;")
}

// 2. Export Schedule E (IRS Schedule E 2026 format)
export function exportScheduleE(property: Property, building?: Building) {
  const cats = expensesByCategory(property)
  const dep = annualDepreciation(property, building)
  const rows: (string | number)[][] = []
  rows.push(["Schedule E (Form 1040) — Tax Year 2026"])
  rows.push(["Supplemental Income and Loss — Rental Real Estate"])
  rows.push([])
  rows.push(["Property", property.name])
  rows.push(["Type", "Rental Real Estate"])
  if (building) {
    rows.push(["Building", building.label])
    rows.push(["Date Purchased", building.purchaseDate])
    rows.push(["Date Placed in Service (first rented)", building.placedInServiceDate])
    rows.push(["Depreciation share for this card (%)", String(property.depreciationShare ?? 100)])
  }
  rows.push([])
  rows.push(["Line", "Description", "Amount"])
  rows.push(["3", "Rents received", totalIncome(property).toFixed(2)])
  rows.push([])
  rows.push(["Expenses", "", ""])
  rows.push(["5", "Advertising", (cats["Advertising"] || 0).toFixed(2)])
  rows.push(["6", "Auto and travel", (cats["Auto and travel"] || 0).toFixed(2)])
  rows.push(["7", "Cleaning and maintenance", (cats["Cleaning and maintenance"] || 0).toFixed(2)])
  rows.push(["8", "Commissions", (cats["Commissions"] || 0).toFixed(2)])
  rows.push(["9", "Insurance", (cats["Insurance"] || 0).toFixed(2)])
  rows.push(["10", "Legal and professional fees", (cats["Legal and professional fees"] || 0).toFixed(2)])
  rows.push(["11", "Management fees", (cats["Management fees"] || 0).toFixed(2)])
  rows.push(["12", "Mortgage interest", (cats["Mortgage interest"] || 0).toFixed(2)])
  rows.push(["13", "Other interest", (cats["Other interest"] || 0).toFixed(2)])
  rows.push(["14", "Repairs", (cats["Repairs"] || 0).toFixed(2)])
  rows.push(["15", "Supplies", (cats["Supplies"] || 0).toFixed(2)])
  rows.push(["16", "Taxes", (cats["Taxes"] || 0).toFixed(2)])
  rows.push(["17", "Utilities", (cats["Utilities"] || 0).toFixed(2)])

  // Other categories not mapped to a standard line
  const standard = new Set([
    "Advertising",
    "Auto and travel",
    "Cleaning and maintenance",
    "Commissions",
    "Insurance",
    "Legal and professional fees",
    "Management fees",
    "Mortgage interest",
    "Other interest",
    "Repairs",
    "Supplies",
    "Taxes",
    "Utilities",
  ])
  let otherTotal = 0
  for (const [cat, amt] of Object.entries(cats)) {
    if (!standard.has(cat)) otherTotal += amt
  }
  rows.push(["19", "Other (list)", otherTotal.toFixed(2)])
  rows.push(["18", "Depreciation expense", dep.toFixed(2)])
  rows.push(["20", "Total expenses", (totalExpenses(property) + dep).toFixed(2)])
  rows.push(["21", "Income or (loss)", netIncome(property, building).toFixed(2)])
  rows.push([])
  rows.push(["NOTE", "Depreciation is an estimate. Confirm eligibility, basis, and amount with your CPA — it only applies once the property was placed in service (rented out)."])

  triggerDownload(rowsToCsv(rows), `${safeName(property.name)}_ScheduleE_2026.csv`, "text/csv;charset=utf-8;")
}

// 3. Export for QuickBooks (IIF file)
export function exportQuickBooksIif(property: Property) {
  const lines: string[] = []
  // Account header
  lines.push("!ACCNT\tNAME\tACCNTTYPE")
  lines.push(`ACCNT\t${property.name} Rental Income\tINC`)
  lines.push(`ACCNT\t${property.name} Expenses\tEXP`)
  lines.push("!TRNS\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tMEMO")
  lines.push("!SPL\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tMEMO")
  lines.push("!ENDTRNS")

  const fmtDate = (d: string) => {
    if (!d) return ""
    const parts = d.split("-")
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`
    return d
  }

  for (const e of property.income) {
    lines.push(
      `TRNS\tDEPOSIT\t${fmtDate(e.date)}\tChecking\t${e.source}\t${e.amount.toFixed(2)}\t${e.notes || ""}`,
    )
    lines.push(
      `SPL\tDEPOSIT\t${fmtDate(e.date)}\t${property.name} Rental Income\t${e.source}\t-${e.amount.toFixed(2)}\t${e.notes || ""}`,
    )
    lines.push("ENDTRNS")
  }
  for (const e of property.expenses) {
    lines.push(
      `TRNS\tCHECK\t${fmtDate(e.date)}\tChecking\t${e.category}\t-${e.amount.toFixed(2)}\t${e.notes || ""}`,
    )
    lines.push(
      `SPL\tCHECK\t${fmtDate(e.date)}\t${property.name} Expenses\t${e.category}\t${e.amount.toFixed(2)}\t${e.notes || ""}`,
    )
    lines.push("ENDTRNS")
  }

  triggerDownload(lines.join("\r\n"), `${safeName(property.name)}.iif`, "application/octet-stream")
}

// 4. Email Me Backup — opens default email with CSV body
export function emailPropertyBackup(property: Property, building?: Building) {
  const rows: (string | number)[][] = []
  rows.push(["INCOME"])
  rows.push(["Date", "Source", "Amount", "Notes"])
  for (const e of property.income) {
    rows.push([e.date, e.source, e.amount.toFixed(2), e.notes])
  }
  rows.push([])
  rows.push(["EXPENSES"])
  rows.push(["Date", "Category", "Amount", "Notes", "Receipt"])
  for (const e of property.expenses) {
    rows.push([e.date, e.category, e.amount.toFixed(2), e.notes, e.receiptName || ""])
  }
  const csv = rowsToCsv(rows)
  // Also download the CSV so user can attach it (true attachments aren't possible via mailto)
  triggerDownload(csv, `${safeName(property.name)}_backup.csv`, "text/csv;charset=utf-8;")

  const subject = encodeURIComponent(`Get Tax Savvy Backup — ${property.name}`)
  const body = encodeURIComponent(
    `Attached is the CSV backup for ${property.name} (downloaded to your device — please attach it).\n\n` +
      `Summary:\nTotal Income: $${totalIncome(property).toFixed(2)}\n` +
      `Total Expenses: $${totalExpenses(property).toFixed(2)}\n` +
      `Net Income: $${netIncome(property, building).toFixed(2)}\n\n--- CSV Data ---\n${csv}`,
  )
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

// Header — Email full JSON backup of everything
export function emailFullBackup(data: AppData) {
  const json = JSON.stringify(data, null, 2)
  triggerDownload(json, `get_tax_savvy_full_backup.json`, "application/json")

  const subject = encodeURIComponent("Get Tax Savvy — Full Backup (restore file)")
  const body = encodeURIComponent(
    "Your complete Get Tax Savvy backup (JSON) has been downloaded to your device. " +
      "Keep this file safe — you can use it to restore all properties and businesses.\n\n" +
      "A short preview is included below.\n\n" +
      json.slice(0, 1500),
  )
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

export { triggerDownload, safeName }

// Business — export income + mileage CSV
export function exportBusinessCsv(business: Business) {
  const rows: (string | number)[][] = []
  rows.push([`Get Tax Savvy — ${business.name}`])
  rows.push([])
  rows.push(["INCOME"])
  rows.push(["Date", "Source", "Amount", "Notes"])
  for (const e of business.income) {
    rows.push([e.date, e.source, e.amount.toFixed(2), e.notes])
  }
  rows.push(["", "Total Income", businessTotalIncome(business).toFixed(2)])
  rows.push([])
  rows.push(["MILEAGE"])
  rows.push(["Date", "Description", "Miles", `Rate (${MILEAGE_RATE})`, "Deduction"])
  for (const m of business.mileage) {
    rows.push([m.date, m.description, m.miles, MILEAGE_RATE.toFixed(2), (m.miles * MILEAGE_RATE).toFixed(2)])
  }
  rows.push(["", "Total Miles", businessTotalMiles(business)])
  rows.push(["", "Mileage Deduction", businessMileageDeduction(business).toFixed(2)])
  rows.push([])
  rows.push(["Net (Income - Mileage)", businessNet(business).toFixed(2)])

  triggerDownload(rowsToCsv(rows), `${safeName(business.name)}_data.csv`, "text/csv;charset=utf-8;")
}
