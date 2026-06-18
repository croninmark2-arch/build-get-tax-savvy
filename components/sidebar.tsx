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
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-gray-900">Get Tax Savvy</h1>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
