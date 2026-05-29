'use client'

import { LayoutDashboard, Utensils, BarChart3, User, ShoppingBag, ClipboardList, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  role: 'consumer' | 'seller'
}

export default function BottomNavigation({ activeTab, onTabChange, role }: BottomNavigationProps) {
  const consumerItems: NavigationItem[] = [
    { id: 'browse', label: 'Jelajah', icon: ShoppingBag },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'impact', label: 'Dampak', icon: Leaf },
    { id: 'account', label: 'Akun', icon: User },
  ]

  const sellerItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: Utensils },
    { id: 'account', label: 'Akun', icon: User },
  ]

  const items = role === 'consumer' ? consumerItems : sellerItems

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#899483]/10 shadow-lg px-2 py-1 pb-safe-bottom">
      <div className={cn("max-w-md mx-auto grid h-14 items-center", role === 'consumer' ? "grid-cols-4" : "grid-cols-3")}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center w-full h-full relative transition-all duration-300 active:scale-90"
              aria-label={item.label}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all duration-300",
                  isActive 
                    ? "text-[#10B981] scale-110" 
                    : "text-slate-400 hover:text-slate-500"
                )}
              >
                <Icon className="w-5 h-5 transition-transform duration-300" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold tracking-tight mt-0.5 transition-all duration-300",
                  isActive 
                    ? "text-[#10B981] font-extrabold" 
                    : "text-slate-400"
                )}
              >
                {item.label}
              </span>
              
              {/* Premium indicator dot */}
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#10B981] animate-fade-in" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
