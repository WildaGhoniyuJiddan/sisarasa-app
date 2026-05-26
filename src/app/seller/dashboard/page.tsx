'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockSellerStats, mockAIPredictions, mockProducts } from '@/lib/mock-data'
import AISurplusPredictorCard from '@/components/seller/AISurplusPredictorCard'
import QuickStatsCard from '@/components/seller/QuickStatsCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, TrendingUp, LogOut, Menu, Sparkles, Clock, Utensils, Lightbulb } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 safe-bottom">
        {/* Welcome Section */}
        <div className="mb-8 p-6 rounded-2xl bg-emerald-50/10 border border-emerald-50 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              Selamat Datang, {user.username}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Pantau prediksi AI untuk surplus makanan Anda, dan kelola donasi untuk melipatgandakan dampak sosial hari ini.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={() => router.push('/seller/upload')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-6 py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Upload Makanan Baru</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/seller/pricing')}
            className="border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl font-bold px-6 py-2.5 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5 shrink-0" />
            <span>Lihat Harga Dinamis</span>
          </Button>
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
          <Card className="lg:col-span-2 p-6 border border-slate-100 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  Produk Aktif Anda
                </h3>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Stok surplus yang sedang dipasarkan</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push('/seller/pricing')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg"
              >
                Lihat Semua
              </Button>
            </div>

            <div className="space-y-3">
              {mockProducts.slice(0, 3).map((product) => {
                const hoursSince = getHoursSince(product.cookedAt)
                const freshnessStatus = getFreshnessStatus(hoursSince)

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100/60 hover:border-emerald-100 hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-emerald-50/80 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                      <Utensils className="w-5 h-5" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-800 truncate tracking-tight">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge
                          variant={
                            freshnessStatus === 'fresh'
                              ? 'success'
                              : freshnessStatus === 'warning'
                              ? 'warning'
                              : 'destructive'
                          }
                          className="rounded-full text-[9px] px-2 font-bold tracking-wider"
                        >
                          {hoursSince}h yang lalu
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">
                          {product.availablePortions}/{product.totalPortions} porsi sisa
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs line-through text-slate-400 font-medium">
                        {formatCurrency(product.normalPrice)}
                      </p>
                      <p className="text-base font-black text-emerald-600 tracking-tight mt-0.5">
                        {formatCurrency(product.currentPrice)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 border border-emerald-100/40 bg-emerald-50/5 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-800 tracking-tight mb-1.5">
                Tips Optimasi Penjualan Hari Ini
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Foto masakan yang cerah dan estetis dapat mendongkrak ketertarikan pembeli hingga 40%!
                Pastikan pencahayaan cukup terang (alami) dan sorot menu dari sudut atas saat melakukan upload stok.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
