'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockMarketplaceProducts } from '@/lib/mock-data'
import { Product } from '@/types'
import { getHoursSince, getFreshnessStatus } from '@/lib/utils'
import ProductCard from '@/components/consumer/ProductCard'
import FilterBar, { FilterOptions } from '@/components/consumer/FilterBar'
import { ShoppingBag, LogOut, Menu } from 'lucide-react'

export default function ConsumerMarketplacePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...mockMarketplaceProducts]

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
  }, [filters])

  const handleProductAction = (product: Product) => {
    if (product.donationStatus === 'donation') {
      // Navigate to claim flow
      router.push(`/consumer/claim/${product.id}`)
    } else {
      // Navigate to purchase flow (to be implemented)
      alert(`Fitur pembelian untuk ${product.name} akan segera hadir!`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-outline">Memuat marketplace...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'consumer') {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-container border-b border-outline/20 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg hover:bg-surface-container-high focus-visible-ring"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6 text-on-surface-variant" />
              </button>
              <div>
                <h1 className="text-xl font-black text-accent-primary">SisaRasa</h1>
                <p className="text-xs text-outline">Marketplace</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-on-surface-variant">
                  {user.username}
                </p>
                <p className="text-xs text-outline">Konsumen</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-surface-container-high text-outline hover:text-critical-red transition-colors focus-visible-ring"
                aria-label="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 safe-bottom">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-on-surface-variant mb-2">
            Selamatkan Makanan, Hemat Pengeluaran 🍽️
          </h2>
          <p className="text-sm text-outline">
            Temukan makanan berkualitas dengan harga terjangkau atau klaim donasi gratis.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-outline">
            Menampilkan <span className="font-bold text-accent-primary">{filteredProducts.length}</span> produk
          </p>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-outline" />
            <span className="text-sm text-outline">
              {filteredProducts.filter((p) => p.donationStatus === 'donation').length} donasi tersedia
            </span>
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAction={handleProductAction}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-panel p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-outline" />
            </div>
            <h3 className="text-lg font-bold text-on-surface-variant mb-2">
              Tidak Ada Produk Ditemukan
            </h3>
            <p className="text-sm text-outline mb-6">
              Coba ubah filter atau kata kunci pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  maxDistance: 5000,
                  freshnessFilter: 'all',
                  priceRange: [0, 100000],
                  sortBy: 'distance',
                })
              }
              className="px-6 py-3 rounded-full bg-accent-primary text-bg-primary font-semibold hover:brightness-110 transition-all focus-visible-ring"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 glass-panel p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💚</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-accent-primary mb-2">
                Cara Kerja SisaRasa
              </h3>
              <ul className="text-sm text-outline space-y-2">
                <li>• <strong>Beli:</strong> Dapatkan makanan berkualitas dengan diskon hingga 50%</li>
                <li>• <strong>Claim Donasi:</strong> Makanan gratis untuk yang membutuhkan (verifikasi diperlukan)</li>
                <li>• <strong>Pickup:</strong> Ambil sendiri di lokasi warung sesuai koordinasi</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
