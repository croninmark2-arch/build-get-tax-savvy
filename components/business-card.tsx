"use client"

import { useState } from "react"
import type { Business, BusinessIncomeEntry, MileageEntry } from "@/lib/types"
import { MILEAGE_RATE } from "@/lib/types"
import { makeId } from "@/lib/storage"
import {
  businessTotalIncome,
  businessTotalMiles,
  businessMileageDeduction,
  businessNet,
} from "@/lib/tax-math"
import { exportBusinessCsv } from "@/lib/exports"

const ACCENT = "#f59e0b"

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function BusinessCard({
  business,
  onChange,
}: {
  business: Business
  onChange: (next: Business) => void
}) {
  const [tab, setTab] = useState<"Income" | "Mileage">("Income")

  return (
    <section
      className="gts-card overflow-hidden"
      style={{
        borderLeftColor: ACCENT,
        backgroundColor: "#422006",
        boxShadow: `0 0 18px ${ACCENT}55`,
      }}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{business.name}</h2>
          <p className="text-sm text-white/70">Business · Mileage @ {money(MILEAGE_RATE)}/mi</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Net</p>
          <p className="text-base font-semibold text-white">{money(businessNet(business))}</p>
        </div>
      </header>

      <div className="mt-3 mx-4 flex gap-1 rounded-md gts-tabs px-2 py-1.5">
        {(["Income", "Mileage"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="rounded px-2.5 py-1.5 text-xs font-medium text-white"
            style={{ backgroundColor: t === tab ? ACCENT : "transparent" }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "Income" ? (
          <IncomeSection business={business} onChange={onChange} />
        ) : (
          <MileageSection business={business} onChange={onChange} />
        )}

        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => exportBusinessCsv(business)}
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:opacity-85"
            style={{ backgroundColor: ACCENT }}
          >
            Export to CSV
          </button>
        </div>
      </div>
    </section>
  )
}

function IncomeSection({
  business,
  onChange,
}: {
  business: Business
  onChange: (next: Business) => void
}) {
  const [date, setDate] = useState("")
  const [source, setSource] = useState("Game fee")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")

  const add = () => {
    if (!amount) return
    const entry: BusinessIncomeEntry = {
      id: makeId(),
      date: date || new Date().toISOString().slice(0, 10),
      source: source || "Game fee",
      amount: Number(amount) || 0,
      notes,
    }
    onChange({ ...business, income: [...business.income, entry] })
    setDate("")
    setSource("Game fee")
    setAmount("")
    setNotes("")
  }

  const remove = (id: string) =>
    onChange({ ...business, income: business.income.filter((e) => e.id !== id) })

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

      <div className="mt-3 space-y-1.5">
        {business.income.length === 0 && (
          <p className="text-sm text-white/50">No income recorded yet.</p>
        )}
        {business.income.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-black/20 px-3 py-2 text-sm text-white">
            <span className="text-white/60">{e.date}</span>
            <span className="min-w-0 flex-1">{e.source}</span>
            <span className="text-white/70">{e.notes}</span>
            <span className="font-medium">{money(e.amount)}</span>
            <button type="button" onClick={() => remove(e.id)} className="ml-auto text-white/50 hover:text-white sm:ml-0" aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-sm font-semibold text-white">
        <span>Total Income</span>
        <span>{money(businessTotalIncome(business))}</span>
      </div>
    </div>
  )
}

function MileageSection({
  business,
  onChange,
}: {
  business: Business
  onChange: (next: Business) => void
}) {
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [miles, setMiles] = useState("")

  const add = () => {
    if (!miles) return
    const entry: MileageEntry = {
      id: makeId(),
      date: date || new Date().toISOString().slice(0, 10),
      description: description || "Trip",
      miles: Number(miles) || 0,
    }
    onChange({ ...business, mileage: [...business.mileage, entry] })
    setDate("")
    setDescription("")
    setMiles("")
  }

  const remove = (id: string) =>
    onChange({ ...business, mileage: business.mileage.filter((m) => m.id !== id) })

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input className="gts-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="gts-input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="gts-input" type="number" inputMode="decimal" placeholder="Miles" value={miles} onChange={(e) => setMiles(e.target.value)} />
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
      >
        + Add Mileage
      </button>

      <div className="mt-3 space-y-1.5">
        {business.mileage.length === 0 && (
          <p className="text-sm text-white/50">No mileage recorded yet.</p>
        )}
        {business.mileage.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-black/20 px-3 py-2 text-sm text-white">
            <span className="text-white/60">{m.date}</span>
            <span className="min-w-0 flex-1">{m.description}</span>
            <span className="text-white/70">{m.miles} mi</span>
            <span className="font-medium">{money(m.miles * MILEAGE_RATE)}</span>
            <button type="button" onClick={() => remove(m.id)} className="ml-auto text-white/50 hover:text-white sm:ml-0" aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-sm text-white/80">
        <span>Total Miles</span>
        <span>{businessTotalMiles(business)} mi</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm font-semibold text-white">
        <span>Mileage Deduction</span>
        <span>{money(businessMileageDeduction(business))}</span>
      </div>
    </div>
  )
}
