"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CheckSquare, 
  AlertTriangle, 
  MessageSquare, 
  Settings, 
  CreditCard 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Actions QHSE",
    href: "/actions",
    icon: CheckSquare,
  },
  {
    title: "Alertes",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Assistant IA",
    href: "/ai",
    icon: MessageSquare,
  },
  {
    title: "Abonnement",
    href: "/upgrade",
    icon: CreditCard,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-[#133B8B] flex items-center justify-center text-white font-bold">
            DQ
          </div>
          <span className="text-xl font-bold text-[#133B8B]">DigiQHSE</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#133B8B] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className="text-xs text-gray-500">
          © 2024 Digitia Solutions
        </div>
      </div>
    </div>
  )
}
