'use client'

import { ShoppingBag, Sparkles } from 'lucide-react'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import FilterBar, { FilterOptions } from './FilterBar'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface BrowseViewProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  filteredProducts: Product[]
  onAction: (product: Product) => void
  user: any
}

export default function BrowseView({
  filters,
  setFilters,
  filteredProducts,
  onAction,
  user,
}: BrowseViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-emerald-50/20 border border-emerald-50/60 shadow-sm transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-inner">
          <ShoppingBag className="w-6 h-6 animate-pulse-slow" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-1 leading-snug">
            Selamatkan Makanan, Hemat Pengeluaran
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            Temukan makanan lezat berkualitas tinggi dengan harga diskon hingga 50% atau klaim donasi sosial gratis.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div>
        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
          Menampilkan <span className="text-[#10B981] font-black">{filteredProducts.length}</span> produk terdekat
        </p>
        <div className="flex items-center gap-1.5 text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
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
              onAction={onAction}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center bg-slate-50/40">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
            <ShoppingBag className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">
            Tidak Ada Makanan Ditemukan
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mb-6 max-w-sm mx-auto">
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
            className="font-bold px-6 rounded-xl text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Reset Filter Pencarian
          </Button>
        </div>
      )}

      {/* Info Banner */}
      <div>
        <Alert className="border-emerald-100 bg-emerald-50/10 p-4 md:p-6 rounded-2xl shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <AlertTitle className="text-emerald-800 font-extrabold text-sm md:text-base tracking-tight mb-2">
            Cara Kerja Penyelamatan Pangan SisaRasa
          </AlertTitle>
          <AlertDescription className="text-emerald-700/90 leading-relaxed text-xs md:text-sm">
            <ul className="space-y-2 mt-2 font-medium">
              <li>• <strong>Beli Hemat:</strong> Selamatkan makanan surplus yang layak dengan diskon reguler hingga 50% untuk mengurangi limbah ekonomi UMKM.</li>
              <li>• <strong>Claim Donasi:</strong> Dapatkan makanan secara gratis untuk pihak yang berhak dengan verifikasi identitas di awal (langkah anti-hoarding).</li>
              <li>• <strong>Pickup Mandiri:</strong> Ambil pesanan langsung ke lokasi mitra warung terdekat dalam radius 5 km sesuai petunjuk Google Maps.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
