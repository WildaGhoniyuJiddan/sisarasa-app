'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockMarketplaceProducts } from '@/lib/mock-data'
import { Product } from '@/types'
import { getHoursSince, getFreshnessStatus } from '@/lib/utils'
import ProductCard from '@/components/consumer/ProductCard'
import FilterBar, { FilterOptions } from '@/components/consumer/FilterBar'
import { ShoppingBag, LogOut, Menu, Sparkles } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-outline">Memuat marketplace...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'consumer') {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#899483]/10 safe-top shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-on-surface-variant hover:bg-neutral-100"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 safe-bottom">
        {/* Welcome Section */}
        <div className="mb-8 flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/20 border border-emerald-50">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <ShoppingBag className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface-variant tracking-tight mb-1">
              Selamatkan Makanan, Hemat Pengeluaran
            </h2>
            <p className="text-sm text-[#bfcab8] font-medium">
              Temukan makanan lezat berkualitas tinggi dengan harga diskon hingga 50% atau klaim donasi sosial gratis.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#899483] uppercase tracking-wider">
            Menampilkan <span className="text-[#10B981] font-black">{filteredProducts.length}</span> produk terdekat
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#899483] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {filteredProducts.filter((p) => p.donationStatus === 'donation').length} donasi aktif
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
          <div className="border border-dashed border-[#899483]/30 rounded-2xl p-12 text-center bg-neutral-50/40">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-[#899483]/10">
              <ShoppingBag className="w-8 h-8 text-[#899483]" />
            </div>
            <h3 className="text-lg font-bold text-on-surface-variant mb-1">
              Tidak Ada Makanan Ditemukan
            </h3>
            <p className="text-sm text-[#bfcab8] mb-6">
              Coba ubah jangkauan filter atau ketik kata kunci pencarian lainnya.
            </p>
            <Button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  maxDistance: 5000,
                  freshnessFilter: 'all',
                  priceRange: [0, 100000],
                  sortBy: 'distance',
                })
              }
              variant="default"
              className="font-bold px-6"
            >
              Reset Filter Pencarian
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8">
          <Alert className="border-emerald-100 bg-emerald-50/10 p-6 rounded-2xl shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
            <AlertTitle className="text-emerald-800 font-extrabold text-base tracking-tight mb-2">
              Cara Kerja Penyelamatan Pangan SisaRasa
            </AlertTitle>
            <AlertDescription className="text-emerald-700/90 leading-relaxed text-sm">
              <ul className="space-y-2 mt-2">
                <li>• <strong>Beli Hemat:</strong> Selamatkan makanan surplus yang layak dengan diskon reguler hingga 50% untuk mengurangi limbah ekonomi UMKM.</li>
                <li>• <strong>Claim Donasi:</strong> Dapatkan makanan secara gratis untuk pihak yang berhak dengan verifikasi identitas di awal (langkah anti-hoarding).</li>
                <li>• <strong>Pickup Mandiri:</strong> Ambil pesanan langsung ke lokasi mitra warung terdekat dalam radius 5 km sesuai petunjuk Google Maps.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
