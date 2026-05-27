'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockSellerStats, mockAIPredictions, mockProducts } from '@/lib/mock-data'
import { Sparkles, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Import modular sub-views
import DashboardView from '@/components/seller/DashboardView'
import ProductsView from '@/components/seller/ProductsView'
import ImpactView from '@/components/seller/ImpactView'
import AccountView from '@/components/seller/AccountView'
import BottomNavigation from '@/components/shared/BottomNavigation'

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-outline">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'seller') {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            router={router}
            stats={mockSellerStats}
            predictions={mockAIPredictions}
            products={mockProducts}
          />
        )
      case 'products':
        return <ProductsView products={mockProducts} router={router} />
      case 'impact':
        return <ImpactView stats={mockSellerStats} />
      case 'account':
        return <AccountView user={user} onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#899483]/10 safe-top shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-black text-[#10B981] tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 animate-pulse-slow" />
                  <span>SisaRasa</span>
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#899483]">Dashboard Mitra Warung</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-on-surface-variant">
                  {user.username}
                </p>
                <p className="text-[10px] font-semibold text-[#899483] uppercase tracking-wider">Mitra Warung</p>
              </div>
              
              {/* Profile Avatar */}
              <Avatar size="default" className="border border-[#899483]/20 shadow-sm cursor-pointer">
                <AvatarFallback className="bg-emerald-50 text-emerald-700 font-extrabold uppercase text-xs">
                  {user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-[#899483] hover:text-[#FF4D4D] hover:bg-red-50 transition-colors duration-200"
                aria-label="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-8 safe-bottom">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        role="seller"
      />
    </div>
  )
}

