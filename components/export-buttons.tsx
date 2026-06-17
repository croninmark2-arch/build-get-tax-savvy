"use client"

import type { Property, Building } from "@/lib/types"
import {
  exportPropertyCsv,
  exportScheduleE,
  exportQuickBooksIif,
  emailPropertyBackup,
} from "@/lib/exports"

export function ExportButtons({
  property,
  building,
  accent,
}: {
  property: Property
  building?: Building
  accent: string
}) {
  const baseBtn =
    "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
      <button
        type="button"
        className={baseBtn}
        style={{ backgroundColor: accent }}
        onClick={() => exportPropertyCsv(property, building)}
      >
        Export to CSV
      </button>
      <button
        type="button"
        className={baseBtn}
        style={{ backgroundColor: accent }}
        onClick={() => exportScheduleE(property, building)}
      >
        Export Schedule E
      </button>
      <button
        type="button"
        className={baseBtn}
        style={{ backgroundColor: accent }}
        onClick={() => exportQuickBooksIif(property)}
      >
        Export for QuickBooks
      </button>
      <button
        type="button"
        className={baseBtn}
        style={{ backgroundColor: "#475569" }}
        onClick={() => emailPropertyBackup(property, building)}
      >
        Email Me Backup
      </button>
    </div>
  )
}
