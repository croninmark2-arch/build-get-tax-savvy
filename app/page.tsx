"use client"

import type { Property, Business } from "@/lib/types"
import { useAppData } from "@/hooks/use-app-data"
import { emailFullBackup } from "@/lib/exports"
import { PropertyCard } from "@/components/property-card"
import { BusinessCard } from "@/components/business-card"
import { AdminPanel } from "@/components/admin-panel"
// Color system for entity types
const categoryColors = {
  llc: "bg-blue-50 border-blue-500 text-blue-900",         // LLC = Blue
  personal: "bg-green-50 border-green-500 text-green-900",  // Personal Home = Green 
  joint: "bg-purple-50 border-purple-500 text-purple-900",  // You+Wife Rentals = Purple
  officiating: "bg-orange-50 border-orange-500 text-orange-900", // Basketball = Orange
}
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
    <main className="mx-auto w-full max-w-6xl px-3 py-6 pb-24 sm:px-4 sm:py-8 lg:px-6 xl:max-w-7xl">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-bold text-white text-balance sm:text-2xl lg:text-3xl">
            Get Tax Savvy
          </h1>
          <p className="text-sm text-white/60 text-pretty">
            Rental property &amp; business income, expenses, and one-click tax exports.
          </p>
        </div>
        <button
          type="button"
          onClick={() => emailFullBackup(data)}
          className="w-full rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 sm:w-auto"
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
              {data.properties.map((p) => (
                <PropertyCard key={p.id} property={p} onChange={updateProperty} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
              Businesses
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
