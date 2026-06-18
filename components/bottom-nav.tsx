"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Receipt, Car, FileText } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: "Properties", href: "/", icon: Home },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Mileage", href: "/mileage", icon: Car },
    { name: "Reports", href: "/reports", icon: FileText },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center py-2 text-xs ${
                isActive? "text-blue-600" : "text-gray-500"
              }`}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
