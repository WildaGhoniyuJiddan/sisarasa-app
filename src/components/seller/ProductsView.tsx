'use client'

import { Plus, Utensils, Edit3, Trash2, ShieldAlert, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getHoursSince, getFreshnessStatus, formatCurrency } from '@/lib/utils'
import { Product } from '@/types'

interface ProductsViewProps {
  products: Product[]
  router: any
}

export default function ProductsView({ products, router }: ProductsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Kelola Pangan Surplus</h2>
          <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Daftar menu aktif & penyesuaian otomatis</p>
        </div>
        
        <Button
          onClick={() => router.push('/seller/upload')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-4 py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Upload Makanan</span>
        </Button>
      </div>

      {/* Products List */}
      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => {
            const hoursSince = getHoursSince(product.cookedAt)
            const freshnessStatus = getFreshnessStatus(hoursSince)
            const isDonation = product.donationStatus === 'donation'

            return (
              <Card
                key={product.id}
                className="p-4 md:p-5 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
              >
                {/* Product Info Row */}
                <div className="flex items-start gap-4">
                  {/* Left Side: Thumbnail placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Utensils className="w-7 h-7" />
                  </div>

                  {/* Middle Side: Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-800 text-sm md:text-base truncate tracking-tight">
                        {product.name}
                      </h3>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[8px] md:text-[9px] px-2 py-0.5 tracking-wider shrink-0">
                        AKTIF DIPASARKAN
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
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
                        {hoursSince} jam yang lalu
                      </Badge>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400">
                        {product.availablePortions}/{product.totalPortions} Porsi sisa
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline gap-2">
                      {isDonation ? (
                        <Badge variant="success" className="rounded-full text-[10px] font-black tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100">
                          DONASI SOSIAL
                        </Badge>
                      ) : (
                        <>
                          <span className="text-[10px] md:text-xs line-through text-slate-400 font-medium">
                            {formatCurrency(product.normalPrice)}
                          </span>
                          <span className="text-base font-black text-emerald-600 tracking-tight">
                            {formatCurrency(product.currentPrice)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-300" />
                    <span>Perlu diawasi</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Fitur diskon AI untuk ${product.name} telah disinkronkan!`)}
                      className="border-emerald-100 text-emerald-600 hover:bg-emerald-50/50 rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimasi AI</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Mengedit porsi untuk ${product.name}`)}
                      className="border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/40">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
            <Utensils className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Stok Pangan Kosong</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Belum ada porsi sisa yang Anda pasarkan hari ini. Pasarkan kelebihan stok Anda sekarang!
          </p>
        </div>
      )}
    </div>
  )
}
