"use client"
import { useState } from "react"
import { Home, Building2, Receipt, BarChart3, Menu } from "lucide-react"

export default function Properties() {
  const [activeTab, setActiveTab] = useState("properties")
  
  const properties = [
    {
      name: "118 Daffodil Drive",
      address: "Horseheads, NY",
      owner: "Personal",
      status: "Owner Occupied",
      headerColor: "#15803D", // Green 700
      bodyColor: "#22C55E",   // Green 500
    },
    {
      name: "114 Orchard St",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      headerColor: "#0F766E", // Teal 700
      bodyColor: "#14B8A6",   // Teal 500
    },
    {
      name: "220 Elmwood Ave",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      headerColor: "#0E7490", // Cyan 700
      bodyColor: "#06B6D4",   // Cyan 500
    },
    {
      name: "146 W Fourth St",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      headerColor: "#1D4ED8", // Blue 700
      bodyColor: "#3B82F6",   // Blue 500
    },
  ]

  const navItems = [
    { id: "properties", label: "Properties", icon: Home },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "menu", label: "Menu", icon: Menu },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">TaxSavvy</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pb-20 lg:pb-0">
        <div className="p-4 sm:p-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8 lg:hidden">TaxSavvy</h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Properties</h2>
          
          <div className="flex flex-col gap-6">
            {properties.map((prop) => (
              <div key={prop.name} className="rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4" style={{ backgroundColor: prop.headerColor }}>
                  <h3 className="text-2xl font-bold text-white">{prop.name}</h3>
                </div>
                <div className="px-6 pt-4 pb-6" style={{ backgroundColor: prop.bodyColor }}>
                  <p className="text-white text-lg font-semibold">{prop.owner}</p>
                  <p className="text-white/90 text-base mb-6">{prop.address || prop.status}</p>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white/25 hover:bg-white/40 text-white font-bold px-6 py-4 rounded-xl border border-white/30 text-lg shadow-lg transition">
                      Details
                    </button>
                    <button className="flex-1 bg-white/25 hover:bg-white/40 text-white font-bold px-6 py-4 rounded-xl border border-white/30 text-lg shadow-lg transition">
                      Expenses
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav - Hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                  isActive ? "text-blue-600" : "text-slate-500"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs font-semibold ${isActive ? "font-bold" : ""}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
