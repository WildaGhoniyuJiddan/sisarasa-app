'use client'

import { Plus, TrendingUp, Utensils, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AISurplusPredictorCard from './AISurplusPredictorCard'
import QuickStatsCard from './QuickStatsCard'
import { getHoursSince, getFreshnessStatus, formatCurrency } from '@/lib/utils'
import { Product, SellerStats } from '@/types'

interface DashboardViewProps {
  user: any
  router: any
  stats: SellerStats
  predictions: any[]
  products: Product[]
}

export default function DashboardView({
  user,
  router,
  stats,
  predictions,
  products,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-4 md:p-6 rounded-2xl bg-emerald-50/10 border border-emerald-50 flex items-start gap-3 md:gap-4 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-emerald-100/50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <Utensils className="w-6 h-6 animate-pulse-slow" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-1 leading-snug">
            Selamat Datang, {user.username}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            Pantau prediksi AI untuk surplus makanan Anda, dan kelola donasi untuk melipatgandakan dampak sosial hari ini.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => router.push('/seller/upload')}
          className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-5 py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <span>Upload Makanan Baru</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/seller/pricing')}
          className="flex-1 sm:flex-initial border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl font-bold px-5 py-3 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
        >
          <TrendingUp className="w-5 h-5 shrink-0" />
          <span>Lihat Harga Dinamis</span>
        </Button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* AI Surplus Predictor - Wide Card */}
        <div className="lg:col-span-2">
          <AISurplusPredictorCard predictions={predictions} />
        </div>

        {/* Quick Stats - Tall Card */}
        <div className="lg:row-span-2">
          <QuickStatsCard stats={stats} />
        </div>

        {/* Recent Products Card */}
        <Card className="lg:col-span-2 p-4 md:p-6 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                Produk Aktif Anda
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Stok surplus yang sedang dipasarkan</p>
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
            {products.slice(0, 3).map((product) => {
              const hoursSince = getHoursSince(product.cookedAt)
              const freshnessStatus = getFreshnessStatus(hoursSince)

              return (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100/60 hover:border-emerald-100 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Product Image Placeholder */}
                    <div className="w-10 h-10 rounded-lg bg-emerald-50/80 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                      <Utensils className="w-5 h-5" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-sm md:text-base truncate tracking-tight">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            freshnessStatus === 'fresh'
                              ? 'success'
                              : freshnessStatus === 'warning'
                              ? 'warning'
                              : 'destructive'
                          }
                          className="rounded-full text-[8px] md:text-[9px] px-2 font-bold tracking-wider"
                        >
                          {hoursSince}h yang lalu
                        </Badge>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400">
                          {product.availablePortions}/{product.totalPortions} porsi sisa
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-left sm:text-right shrink-0 pl-13 sm:pl-0">
                    <p className="text-[10px] md:text-xs line-through text-slate-400 font-medium">
                      {formatCurrency(product.normalPrice)}
                    </p>
                    <p className="text-sm md:text-base font-black text-emerald-600 tracking-tight mt-0.5">
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
      <Card className="p-4 md:p-6 border border-emerald-100/40 bg-emerald-50/5 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-emerald-800 tracking-tight mb-1.5">
              Tips Optimasi Penjualan Hari Ini
            </h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              Foto masakan yang cerah dan estetis dapat mendongkrak ketertarikan pembeli hingga 40%!
              Pastikan pencahayaan cukup terang (alami) dan sorot menu dari sudut atas saat melakukan upload stok.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
