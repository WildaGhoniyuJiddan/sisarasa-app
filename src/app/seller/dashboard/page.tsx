'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockSellerStats, mockAIPredictions, mockProducts } from '@/lib/mock-data'
import AISurplusPredictorCard from '@/components/seller/AISurplusPredictorCard'
import QuickStatsCard from '@/components/seller/QuickStatsCard'
import TactileButton from '@/components/ui/TactileButton'
import { Camera, TrendingDown, LogOut, Menu } from 'lucide-react'
import { getHoursSince, getFreshnessStatus, formatCurrency } from '@/lib/utils'

export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
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
                <p className="text-xs text-outline">Dashboard Penjual</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-on-surface-variant">
                  {user.username}
                </p>
                <p className="text-xs text-outline">Mitra Warung</p>
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
        <div className="mb-8">
          <h2 className="text-2xl font-black text-on-surface-variant mb-2">
            Selamat Datang, {user.username}! 👋
          </h2>
          <p className="text-sm text-outline">
            Kelola surplus makanan Anda dan pantau dampak sosial yang telah Anda ciptakan.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TactileButton
            onClick={() => router.push('/seller/upload')}
            className="flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span>Upload Makanan Baru</span>
          </TactileButton>
          <TactileButton
            variant="secondary"
            onClick={() => router.push('/seller/pricing')}
            className="flex items-center gap-2"
          >
            <TrendingDown className="w-5 h-5" />
            <span>Lihat Harga Dinamis</span>
          </TactileButton>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Surplus Predictor - Wide Card */}
          <div className="lg:col-span-2">
            <AISurplusPredictorCard predictions={mockAIPredictions} />
          </div>

          {/* Quick Stats - Tall Card */}
          <div className="lg:row-span-2">
            <QuickStatsCard stats={mockSellerStats} />
          </div>

          {/* Recent Products Card */}
          <div className="lg:col-span-2 bento-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface-variant">
                Produk Aktif Anda
              </h3>
              <button
                type="button"
                onClick={() => router.push('/seller/pricing')}
                className="text-sm font-semibold text-accent-primary hover:underline focus-visible-ring"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {mockProducts.slice(0, 3).map((product) => {
                const hoursSince = getHoursSince(product.cookedAt)
                const freshnessStatus = getFreshnessStatus(hoursSince)

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-high border border-outline/20 hover:border-accent-primary/40 transition-all"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-on-surface-variant truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            freshnessStatus === 'fresh'
                              ? 'bg-fresh-mint/20 text-fresh-mint'
                              : freshnessStatus === 'warning'
                              ? 'bg-warning-mint/20 text-warning-mint'
                              : 'bg-critical-red/20 text-critical-red'
                          }`}
                        >
                          {hoursSince}h yang lalu
                        </span>
                        <span className="text-xs text-outline">
                          {product.availablePortions}/{product.totalPortions} porsi
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm line-through text-outline">
                        {formatCurrency(product.normalPrice)}
                      </p>
                      <p className="text-lg font-bold text-accent-primary">
                        {formatCurrency(product.currentPrice)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="glass-panel p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-accent-primary mb-2">
                Tips Hari Ini
              </h3>
              <p className="text-sm text-outline leading-relaxed">
                Foto makanan yang menarik dapat meningkatkan penjualan hingga 40%!
                Pastikan pencahayaan baik dan tampilkan makanan dari sudut terbaik saat upload.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
