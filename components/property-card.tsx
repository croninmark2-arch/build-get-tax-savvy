"use client"

import { useRef, useState } from "react"
import type { Property, Building, IncomeEntry, ExpenseEntry } from "@/lib/types"
import { makeId } from "@/lib/storage"
import {
  totalIncome,
  totalExpenses,
  annualDepreciation,
  buildingDepreciation,
  depreciationNeedsReview,
} from "@/lib/tax-math"
import { ExportButtons } from "./export-buttons"

const TABS = ["Details", "Income", "Expenses", "Monthly Ledger", "Schedule E 2026"] as const
type Tab = (typeof TABS)[number]

const EXPENSE_CATEGORIES = [
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
  "Other",
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function leaseStatusLabel(p: Property) {
  if (p.status === "Vacant") return "Vacant"
  if (p.monthToMonth) return "Month-to-month"
  if (p.leaseEndDate) return `Lease ends ${p.leaseEndDate}`
  return "Leased"
}

export function PropertyCard({
  property,
  building,
  sharedWithLabels,
  onChange,
  onBuildingChange,
}: {
  property: Property
  building?: Building
  sharedWithLabels: string[] // other card names that share this building
  onChange: (next: Property) => void
  onBuildingChange: (next: Building) => void
}) {
  const [tab, setTab] = useState<Tab>("Details")
  const accent = property.theme.border

  return (
    <section
      className="gts-card overflow-hidden"
      style={{
        borderLeftColor: accent,
        backgroundColor: property.theme.bg,
        boxShadow: `0 0 18px ${accent}55`,
      }}
    >
      <header className="px-4 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white text-balance sm:text-lg">
              {property.name}
            </h2>
            <p className="text-sm text-white/70 text-pretty">
              {property.ownership}
              {property.monthlyRent > 0 ? ` · ${money(property.monthlyRent)}/mo` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Net (income − expenses)</p>
            <p className="text-base font-semibold text-white">
              {money(totalIncome(property) - totalExpenses(property))}
            </p>
          </div>
        </div>

        {/* Tenant snapshot on the card front */}
        <div className="mt-3 rounded-md bg-black/25 p-3">
          <p className="text-sm text-white">
            {property.tenantName || (property.status === "Vacant" ? "Vacant" : "Tenant not set")}
          </p>
          <p className="text-xs text-white/60">
            {property.moveInDate ? `Moved in ${property.moveInDate} · ` : ""}
            {leaseStatusLabel(property)}
          </p>
          {sharedWithLabels.length > 0 && (
            <p className="mt-1 text-xs text-white/50">
              Shares one purchase with {sharedWithLabels.join(", ")}
            </p>
          )}
        </div>
      </header>

      {/* Tabs — horizontally scrollable on small screens */}
      <div className="mt-3 flex gap-1 overflow-x-auto px-2 py-1.5 mx-4 rounded-md gts-tabs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="shrink-0 whitespace-nowrap rounded px-2.5 py-1.5 text-xs font-medium text-white transition-colors"
              style={{ backgroundColor: active ? accent : "transparent" }}
            >
              {t}
            </button>
          )
        })}
      </div>

      <div className="p-4">
        {tab === "Details" && (
          <DetailsTab
            property={property}
            building={building}
            sharedWithLabels={sharedWithLabels}
            onChange={onChange}
            onBuildingChange={onBuildingChange}
          />
        )}
        {tab === "Income" && <IncomeTab property={property} onChange={onChange} />}
        {tab === "Expenses" && <ExpensesTab property={property} onChange={onChange} accent={accent} />}
        {tab === "Monthly Ledger" && <LedgerTab property={property} />}
        {tab === "Schedule E 2026" && <ScheduleETab property={property} building={building} />}

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/60">Export</p>
          <ExportButtons property={property} building={building} accent={accent} />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Details (tenant + lease + basis) ----------------------------- */
function DetailsTab({
  property,
  building,
  sharedWithLabels,
  onChange,
  onBuildingChange,
}: {
  property: Property
  building?: Building
  sharedWithLabels: string[]
  onChange: (next: Property) => void
  onBuildingChange: (next: Building) => void
}) {
  const set = (patch: Partial<Property>) => onChange({ ...property, ...patch })
  const leaseRef = useRef<HTMLInputElement>(null)

  const onLease = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ leaseName: file.name, leaseData: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-5">
      {/* Tenant + lease */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="Ownership">
          <select
            className="gts-input"
            value={property.ownership}
            onChange={(e) => set({ ownership: e.target.value as Property["ownership"] })}
          >
            <option value="LLC">LLC</option>
            <option value="Personal">Personal</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            className="gts-input"
            value={property.status}
            onChange={(e) => set({ status: e.target.value as Property["status"] })}
          >
            <option value="Rented">Rented</option>
            <option value="Vacant">Vacant</option>
          </select>
        </Field>
        <Field label="Tenant name">
          <input
            className="gts-input"
            value={property.tenantName}
            placeholder="e.g. Jane Doe"
            onChange={(e) => set({ tenantName: e.target.value })}
          />
        </Field>
        <Field label="Monthly rent ($)">
          <input
            className="gts-input"
            type="number"
            inputMode="decimal"
            value={property.monthlyRent || ""}
            onChange={(e) => set({ monthlyRent: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Original move-in date">
          <input
            className="gts-input"
            type="date"
            value={property.moveInDate}
            onChange={(e) => set({ moveInDate: e.target.value })}
          />
        </Field>
        <Field label="Lease end date">
          <input
            className="gts-input"
            type="date"
            value={property.leaseEndDate}
            disabled={property.monthToMonth}
            onChange={(e) => set({ leaseEndDate: e.target.value })}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          checked={property.monthToMonth}
          onChange={(e) =>
            set({ monthToMonth: e.target.checked, leaseEndDate: e.target.checked ? "" : property.leaseEndDate })
          }
        />
        Month-to-month
      </label>

      {/* Lease upload */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={leaseRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => onLease(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => leaseRef.current?.click()}
          className="rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
        >
          Upload lease
        </button>
        {property.leaseName ? (
          <a
            href={property.leaseData}
            download={property.leaseName}
            className="truncate text-xs text-white/80 underline hover:text-white"
          >
            {property.leaseName}
          </a>
        ) : (
          <span className="text-xs text-white/50">No lease uploaded</span>
        )}
        {property.leaseName && (
          <button
            type="button"
            onClick={() => set({ leaseName: undefined, leaseData: undefined })}
            className="text-xs text-white/50 hover:text-white"
            aria-label="Remove lease"
          >
            ✕
          </button>
        )}
      </div>

      {/* Behind-the-scenes tax basis — shared across cards on the same building */}
      <BasisSection
        property={property}
        building={building}
        sharedWithLabels={sharedWithLabels}
        onChange={set}
        onBuildingChange={onBuildingChange}
      />
    </div>
  )
}

function BasisSection({
  property,
  building,
  sharedWithLabels,
  onChange,
  onBuildingChange,
}: {
  property: Property
  building?: Building
  sharedWithLabels: string[]
  onChange: (patch: Partial<Property>) => void
  onBuildingChange: (next: Building) => void
}) {
  const isShared = sharedWithLabels.length > 0
  const totalDep = buildingDepreciation(building)
  const myDep = annualDepreciation(property, building)
  const review = depreciationNeedsReview(building)
  const setB = (patch: Partial<Building>) => building && onBuildingChange({ ...building, ...patch })

  return (
    <div className="rounded-md border border-white/15 bg-black/25 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
        Tax basis (whole building)
      </p>
      <p className="mt-1 text-xs text-white/50 text-pretty">
        {isShared
          ? `This is one duplex purchase shared with ${sharedWithLabels.join(", ")}. Enter the purchase once here — editing it updates the linked card(s) too, so it's never double-counted.`
          : "Entered once for the whole building. Even a duplex is depreciated as one building, not per unit."}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Field label="Purchase price ($)">
          <input
            className="gts-input"
            type="number"
            inputMode="decimal"
            value={building?.purchasePrice || ""}
            onChange={(e) => setB({ purchasePrice: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Date purchased">
          <input
            className="gts-input"
            type="date"
            value={building?.purchaseDate || ""}
            onChange={(e) => setB({ purchaseDate: e.target.value })}
          />
        </Field>
        <Field label="Date first rented out">
          <input
            className="gts-input"
            type="date"
            value={building?.placedInServiceDate || ""}
            onChange={(e) => setB({ placedInServiceDate: e.target.value })}
          />
        </Field>
      </div>

      {isShared && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field label="This card's share of depreciation (%)">
            <input
              className="gts-input"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              value={property.depreciationShare ?? 50}
              onChange={(e) =>
                onChange({ depreciationShare: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })
              }
            />
          </Field>
          <div className="flex items-end pb-2 text-xs text-white/50">
            Split the building&apos;s depreciation between the units (e.g. 50% + 50%).
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2 rounded-md bg-black/30 p-3">
        <div>
          <p className="text-xs text-white/60">
            {isShared ? "This card's depreciation" : "Estimated annual depreciation"}
          </p>
          <p className="text-lg font-semibold text-white">
            {building?.placedInServiceDate ? money(myDep) : "—"}
          </p>
          {isShared && building?.placedInServiceDate && (
            <p className="mt-1 text-[11px] text-white/50">
              Whole building: {money(totalDep)} · this card {property.depreciationShare ?? 50}%
            </p>
          )}
          {!isShared && <p className="mt-1 text-[11px] text-white/50">(Purchase × 0.8) ÷ 27.5 yrs</p>}
        </div>
      </div>

      <div className="mt-3 rounded-md border border-amber-400/40 bg-amber-400/10 p-3">
        <p className="text-xs font-semibold text-amber-200">⚠ Confirm with your CPA</p>
        <p className="mt-1 text-xs text-amber-100/90 text-pretty">
          This is an estimate only. Depreciation can only start when the property is{" "}
          <em>placed in service</em> (actually rented out) — which may be years after you bought it
          if you lived there first. Your accountant should confirm eligibility, the correct
          depreciable basis (land is not depreciable), and the exact amount before filing.
          {review &&
            " Heads up: the purchase date and the date you started renting are far apart (or the rental-start date is missing), so this especially needs review."}
        </p>
      </div>
    </div>
  )
}

/* ----------------------------- Income ----------------------------- */
function IncomeTab({
  property,
  onChange,
}: {
  property: Property
  onChange: (next: Property) => void
}) {
  const [date, setDate] = useState("")
  const [source, setSource] = useState("Rent")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")

  const add = () => {
    if (!amount) return
    const entry: IncomeEntry = {
      id: makeId(),
      date: date || new Date().toISOString().slice(0, 10),
      source: source || "Rent",
      amount: Number(amount) || 0,
      notes,
    }
    onChange({ ...property, income: [...property.income, entry] })
    setDate("")
    setSource("Rent")
    setAmount("")
    setNotes("")
  }

  const remove = (id: string) =>
    onChange({ ...property, income: property.income.filter((e) => e.id !== id) })

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input className="gts-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="gts-input" placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
        <input className="gts-input" type="number" inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="gts-input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
      >
        + Add Income
      </button>

      <EntryList
        empty="No income recorded yet."
        rows={property.income.map((e) => ({
          id: e.id,
          cols: [e.date, e.source, money(e.amount), e.notes],
        }))}
        onRemove={remove}
      />
      <Totals label="Total Income" value={money(totalIncome(property))} />
    </div>
  )
}

/* ----------------------------- Expenses ----------------------------- */
function ExpensesTab({
  property,
  onChange,
  accent,
}: {
  property: Property
  onChange: (next: Property) => void
  accent: string
}) {
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("Repairs")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [receiptName, setReceiptName] = useState<string | undefined>()
  const [receiptData, setReceiptData] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  const onReceipt = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setReceiptName(file.name)
      setReceiptData(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const add = () => {
    if (!amount) return
    const entry: ExpenseEntry = {
      id: makeId(),
      date: date || new Date().toISOString().slice(0, 10),
      category,
      amount: Number(amount) || 0,
      notes,
      receiptName,
      receiptData,
    }
    onChange({ ...property, expenses: [...property.expenses, entry] })
    setDate("")
    setCategory("Repairs")
    setAmount("")
    setNotes("")
    setReceiptName(undefined)
    setReceiptData(undefined)
    if (fileRef.current) fileRef.current.value = ""
  }

  const remove = (id: string) =>
    onChange({ ...property, expenses: property.expenses.filter((e) => e.id !== id) })

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input className="gts-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="gts-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input className="gts-input" type="number" inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="gts-input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onReceipt(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-md px-3 py-2 text-sm font-medium text-white hover:opacity-85"
          style={{ backgroundColor: accent }}
        >
          📷 Add Receipt
        </button>
        {receiptData && (
          <span className="flex items-center gap-2 text-xs text-white/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={receiptData || "/placeholder.svg"}
              alt={`Receipt ${receiptName}`}
              className="h-10 w-10 rounded object-cover"
            />
            {receiptName}
          </span>
        )}
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
        >
          + Add Expense
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {property.expenses.length === 0 && (
          <p className="text-sm text-white/50">No expenses recorded yet.</p>
        )}
        {property.expenses.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-md bg-black/20 px-3 py-2 text-sm text-white"
          >
            {e.receiptData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.receiptData || "/placeholder.svg"}
                alt={`Receipt for ${e.category}`}
                className="h-10 w-10 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10 text-[10px] text-white/40">
                none
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate">
                <span className="text-white/60">{e.date}</span> · {e.category}
                {e.notes ? ` · ${e.notes}` : ""}
              </p>
              {e.receiptName && <p className="truncate text-xs text-white/50">{e.receiptName}</p>}
            </div>
            <span className="font-medium">{money(e.amount)}</span>
            <button
              type="button"
              onClick={() => remove(e.id)}
              className="text-white/50 hover:text-white"
              aria-label="Remove expense"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <Totals label="Total Expenses" value={money(totalExpenses(property))} />
    </div>
  )
}

/* ----------------------------- Monthly Ledger ----------------------------- */
function LedgerTab({ property }: { property: Property }) {
  const rows = MONTHS.map((m, i) => {
    const monthNum = String(i + 1).padStart(2, "0")
    const inc = property.income
      .filter((e) => e.date.slice(5, 7) === monthNum)
      .reduce((s, e) => s + e.amount, 0)
    const exp = property.expenses
      .filter((e) => e.date.slice(5, 7) === monthNum)
      .reduce((s, e) => s + e.amount, 0)
    return { m, inc, exp, net: inc - exp }
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="text-left text-white/60">
            <th className="py-1.5 pr-4 font-medium">Month</th>
            <th className="py-1.5 pr-4 text-right font-medium">Income</th>
            <th className="py-1.5 pr-4 text-right font-medium">Expenses</th>
            <th className="py-1.5 text-right font-medium">Net</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.m} className="border-t border-white/10">
              <td className="py-1.5 pr-4">{r.m}</td>
              <td className="py-1.5 pr-4 text-right">{money(r.inc)}</td>
              <td className="py-1.5 pr-4 text-right">{money(r.exp)}</td>
              <td className="py-1.5 text-right">{money(r.net)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-white/20 font-semibold">
            <td className="py-1.5 pr-4">Total</td>
            <td className="py-1.5 pr-4 text-right">{money(totalIncome(property))}</td>
            <td className="py-1.5 pr-4 text-right">{money(totalExpenses(property))}</td>
            <td className="py-1.5 text-right">
              {money(totalIncome(property) - totalExpenses(property))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ----------------------------- Schedule E ----------------------------- */
function ScheduleETab({ property, building }: { property: Property; building?: Building }) {
  const dep = annualDepreciation(property, building)
  const inc = totalIncome(property)
  const exp = totalExpenses(property)
  const net = inc - exp - dep

  const line = (n: string, label: string, val: number) => (
    <div className="flex items-center justify-between border-t border-white/10 py-1.5 text-sm">
      <span className="text-white/80">
        <span className="text-white/40">Ln {n}</span> {label}
      </span>
      <span className="font-medium text-white">{money(val)}</span>
    </div>
  )

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-white">Schedule E (Form 1040) — 2026</p>
      {line("3", "Rents received", inc)}
      {line("18", "Depreciation expense", dep)}
      {line("20", "Total expenses", exp + dep)}
      <div className="mt-2 flex items-center justify-between border-t border-white/20 py-2 text-sm font-semibold">
        <span className="text-white">Ln 21 · Income or (loss)</span>
        <span className="text-white">{money(net)}</span>
      </div>
      <p className="mt-2 text-xs text-white/50 text-pretty">
        Depreciation is an estimate{building?.placedInServiceDate ? "" : " (no rental-start date set, so it shows as $0)"} and{" "}
        <strong className="text-amber-200">must be confirmed by your CPA</strong> — it only applies
        from the date the property was placed in service (actually rented out). Use “Export Schedule
        E” below for the full file.
      </p>
    </div>
  )
}

/* ----------------------------- Shared ----------------------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-white/80">
      <span className="text-xs text-white/60">{label}</span>
      {children}
    </label>
  )
}

function EntryList({
  rows,
  onRemove,
  empty,
}: {
  rows: { id: string; cols: string[] }[]
  onRemove: (id: string) => void
  empty: string
}) {
  if (rows.length === 0) return <p className="mt-3 text-sm text-white/50">{empty}</p>
  return (
    <div className="mt-3 space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.id}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-black/20 px-3 py-2 text-sm text-white"
        >
          <span className="text-white/60">{r.cols[0]}</span>
          <span className="min-w-0 flex-1">{r.cols[1]}</span>
          <span className="text-white/70">{r.cols[3]}</span>
          <span className="font-medium">{r.cols[2]}</span>
          <button
            type="button"
            onClick={() => onRemove(r.id)}
            className="ml-auto text-white/50 hover:text-white sm:ml-0"
            aria-label="Remove entry"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

function Totals({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-sm font-semibold text-white">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
