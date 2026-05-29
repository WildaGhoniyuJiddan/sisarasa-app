'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
// No mockMarketplaceProducts import - only real backend products used
import { Product as FrontendProduct, DonationStatus, ProductStatus } from '@/types'
import { getHoursSince, getFreshnessStatus } from '@/lib/utils'
import { Sparkles, LogOut, RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Import API services
import { getProducts, Product } from '@/services/api'

// Import modular sub-views
import BrowseView from '@/components/consumer/BrowseView'
import OrdersView from '@/components/consumer/OrdersView'
import ImpactView from '@/components/consumer/ImpactView'
import AccountView from '@/components/consumer/AccountView'
import BottomNavigation from '@/components/shared/BottomNavigation'
import { FilterOptions } from '@/components/consumer/FilterBar'

export default function ConsumerMarketplacePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<string>('browse')
  const [backendProducts, setBackendProducts] = useState<FrontendProduct[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    maxDistance: 5000,
    freshnessFilter: 'all',
    priceRange: [0, 100000],
    sortBy: 'distance',
  })

  // Redirect if not authenticated or not a consumer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'consumer')) {
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

        const apiProducts = await getProducts()

        // Map backend API data to frontend types (enriching mock portions)
        const mapped: FrontendProduct[] = apiProducts.map((p: Product) => ({
          id: p.id,
          sellerId: p.sellerId,
          sellerName: 'Warung Mitra SisaRasa', // Default display name
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
          // Generasikan jarak acak 100m - 3500m untuk keperluan demo geospasial (maks 5km radius)
          distance: Math.floor(Math.random() * 3400) + 100,
        }))

        setBackendProducts(mapped)
      } catch (err: any) {
        console.error('Error fetching marketplace products:', err)
        setFetchError('Gagal menghubungkan ke server untuk sinkronisasi data aktif.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchRealData()
  }, [isAuthenticated, user])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    // Gunakan backendProducts jika ada data riil
    let products = [...backendProducts]

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sellerName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    // Apply distance filter
    products = products.filter((p) => (p.distance || 0) <= filters.maxDistance)

    // Apply freshness filter
    if (filters.freshnessFilter !== 'all') {
      products = products.filter((p) => {
        const status = getFreshnessStatus(getHoursSince(p.cookedAt))
        return status === filters.freshnessFilter
      })
    }

    // Apply sorting
    products.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        case 'price':
          return a.currentPrice - b.currentPrice
        case 'freshness':
          return getHoursSince(a.cookedAt) - getHoursSince(b.cookedAt)
        default:
          return 0
      }
    })

    return products
  }, [filters, backendProducts])

  const handleProductAction = (product: FrontendProduct) => {
    if (product.donationStatus === 'donation') {
      // Navigate to claim flow
      router.push(`/consumer/claim/${product.id}`)
    } else {
      // Navigate to purchase flow
      router.push(`/consumer/purchase/${product.id}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading || (isFetching && backendProducts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Menyinkronkan lapak surplus...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'consumer') {
    return null
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <BrowseView
            filters={filters}
            setFilters={setFilters}
            filteredProducts={filteredProducts}
            onAction={handleProductAction}
            user={user}
          />
        )
      case 'orders':
        return <OrdersView />
      case 'impact':
        return <ImpactView />
      case 'account':
        return <AccountView user={user} onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#899483]/10 safe-top shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-black text-[#10B981] tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5" />
                  <span>SisaRasa</span>
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#899483]">Marketplace Konsumen</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-on-surface-variant">
                  {user.username}
                </p>
                <p className="text-[10px] font-semibold text-[#899483] uppercase tracking-wider">Konsumen</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-8 safe-bottom">
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
        role="consumer"
      />
    </div>
  )
}


