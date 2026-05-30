'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Sparkles, LogOut, RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { getProducts, Product, getSellerStats } from '@/services/api'
import { Product as FrontendProduct, DonationStatus, ProductStatus } from '@/types'

// Import modular sub-views
import DashboardView from '@/components/seller/DashboardView'
import ProductsView from '@/components/seller/ProductsView'
import AccountView from '@/components/seller/AccountView'
import BottomNavigation from '@/components/shared/BottomNavigation'

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, token } = useAuth()
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [products, setProducts] = useState<FrontendProduct[]>([])
  const [stats, setStats] = useState<{ revenue: number; totalSold: number }>({ revenue: 0, totalSold: 0 })
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  // Fetch real-time products from FastAPI backend
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsFetching(false)
      return
    }

    const fetchRealData = async () => {
      try {
        setIsFetching(true)
        setFetchError(null)
        
        // Fetch active products from backend
        const apiProducts = await getProducts()

        // Fetch stats if token is available
        if (token) {
          try {
            const statsData = await getSellerStats(token)
            setStats({
              revenue: statsData.revenue,
              totalSold: statsData.total_sold,
            })
          } catch (statsErr) {
            console.error('Error fetching seller stats:', statsErr)
          }
        }

        // Map backend API data to frontend types using REAL data
        const mapped: FrontendProduct[] = apiProducts.map((p: Product) => ({
          id: p.id,
          sellerId: p.sellerId,
          sellerName: user.username || 'Mitra Warung',
          name: p.name,
          description: 'Makanan surplus lezat, higienis, dan dikelola secara aman.',
          photoUrl: p.photoUrl || '/images/sayur.jpg',
          normalPrice: p.normalPrice,
          currentPrice: p.currentPrice,
          cookedAt: p.cookedAt,
          totalPortions: p.portions || 1,
          availablePortions: p.availablePortions !== undefined ? p.availablePortions : (p.portions || 1),
          donationStatus: 'sale' as DonationStatus,
          status: (p.status as ProductStatus) || 'active',
        }))

        // Filter products that belong to this seller's store.
        const sellerProducts = mapped.filter((p) => p.sellerId === user.id)
        setProducts(sellerProducts)

      } catch (err: any) {
        console.error('Error fetching real-time products:', err)
        setFetchError('Gagal menyinkronkan data dengan server.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchRealData()
  }, [isAuthenticated, user, token])

  if (isLoading || (isFetching && products.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Menyinkronkan data Firestore...</p>
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
            products={products}
            revenue={stats.revenue}
            totalSold={stats.totalSold}
          />
        )
      case 'products':
        return <ProductsView products={products} router={router} />
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
              <Avatar className="w-9 h-9 border border-[#899483]/20 shadow-sm cursor-pointer">
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
        {fetchError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-700 flex items-center justify-between">
            <span>{fetchError} (Menampilkan data lokal sementara)</span>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center gap-1 hover:underline text-rose-800"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload
            </button>
          </div>
        )}
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
