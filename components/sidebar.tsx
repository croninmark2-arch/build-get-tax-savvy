"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Receipt, Car, FileText } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  
  const tabs = [
    { name: "Properties", href: "/", icon: Home },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Mileage", href: "/mileage", icon: Car },
    { name: "Reports", href: "/reports", icon: FileText },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
        <div className="px-4 pb-6 flex items-center gap-3">
          {/* LOGO: Angled split fluorescent green/red $ */}
          <div className="h-10 w-10 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF7F] from-50% to-[#EF4444] to-50%"></div>
            <span className="relative text-white font-black text-2xl drop-shadow-md">$</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1E3A8A]">Get Tax Savvy</h1>
            <p className="text-xs text-gray-500">Real Estate + Tax Tools</p>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-[#1E3A8A] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${isActive ? "text-[#00FF7F]" : "text-gray-400"}`} />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
