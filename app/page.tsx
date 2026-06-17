"use client"

import type { Property, Business } from "@/lib/types"
import { useAppData } from "@/hooks/use-app-data"
import { emailFullBackup } from "@/lib/exports"
import { PropertyCard } from "@/components/property-card"
import { BusinessCard } from "@/components/business-card"
import { AdminPanel } from "@/components/admin-panel"

export default function Page() {
  const { data, update, loaded } = useAppData()

  const updateProperty = (next: Property) =>
    update((prev) => ({
      ...prev,
      properties: prev.properties.map((p) => (p.id === next.id ? next : p)),
    }))

  const updateBusiness = (next: Business) =>
    update((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) => (b.id === next.id ? next : b)),
    }))

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-24">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white text-balance">Get Tax Savvy</h1>
          <p className="text-sm text-white/60">
            Rental property &amp; business income, expenses, and one-click tax exports.
          </p>
        </div>
        <button
          type="button"
          onClick={() => emailFullBackup(data)}
          className="rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
        >
          Email Full Backup
        </button>
      </header>

      {!loaded ? (
        <p className="text-white/50">Loading…</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
              Properties
            </h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {data.properties.map((p) => (
                <PropertyCard key={p.id} property={p} onChange={updateProperty} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
              Businesses
            </h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {data.businesses.map((b) => (
                <BusinessCard key={b.id} business={b} onChange={updateBusiness} />
              ))}
            </div>
          </section>
        </div>
      )}

      <AdminPanel
        billingEnabled={data.billingEnabled}
        onToggleBilling={(next) => update((prev) => ({ ...prev, billingEnabled: next }))}
      />
    </main>
  )
}
