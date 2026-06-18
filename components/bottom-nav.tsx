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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center py-2 px-3 w-full"
            >
              <tab.icon 
                className={`h-6 w-6 ${isActive ? "text-[#1E3A8A]" : "text-gray-400"}`} 
              />
              <span className={`text-xs mt-1 ${isActive ? "text-[#1E3A8A] font-semibold" : "text-gray-500"}`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="h-0.5 w-8 bg-[#00FF7F] rounded-full mt-0.5"></div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
