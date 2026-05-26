import { Leaf, Heart, Coins, Sparkles, Trophy } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SellerStats {
  totalWasteSaved: number // in kg
  totalPortionsSaved: number
  totalRevenue: number
  activeProducts: number
}

interface QuickStatsCardProps {
  stats: SellerStats
}

export default function QuickStatsCard({ stats }: QuickStatsCardProps) {
  return (
    <Card className="p-6 border border-slate-100 bg-white shadow-sm rounded-2xl flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0 animate-pulse-slow">
          <Heart className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Dampak Sosial & Ekonomi</h3>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Kontribusi Hijau Warung Anda</p>
        </div>
      </div>

      {/* Main Metric - Waste Saved */}
      <div className="space-y-5">
        <div className="p-5 rounded-xl bg-emerald-50/20 border border-emerald-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-5xl font-black text-emerald-600 tracking-tighter">
              {stats.totalWasteSaved.toFixed(1)}
            </span>
            <span className="text-xl font-extrabold text-emerald-700">kg</span>
          </div>
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Total Limbah Makanan Terselamatkan
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>Setara dengan membantu penyelamatan <strong className="text-emerald-700 font-bold">{stats.totalPortionsSaved}</strong> porsi pangan</span>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/60 hover:bg-white hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pendapatan</span>
            </div>
            <p className="text-base font-black text-slate-800 tracking-tight">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Surplus Terjual</p>
          </div>

          {/* Active Products */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/60 hover:bg-white hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Aktif</span>
            </div>
            <p className="text-lg font-black text-slate-800 tracking-tight">
              {stats.activeProducts}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Produk Menu Aktif</p>
          </div>
        </div>

        {/* Environmental Impact Details */}
        <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Dampak Carbon Offset:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400">Pengurangan CO₂</span>
              <span className="font-extrabold text-emerald-600">
                ≈ {(stats.totalWasteSaved * 2.5).toFixed(1)} kg
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400">Setara Penanaman</span>
              <span className="font-extrabold text-emerald-600">
                {Math.round(stats.totalWasteSaved * 0.5)} Pohon Hijau
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/40 text-center shadow-inner">
          <div className="text-2xl mb-1">🌱</div>
          <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
            Pahlawan Lingkungan Hijau
          </p>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Terima kasih telah berkontribusi mencegah limbah pangan di Indonesia!
          </p>
        </div>
      </div>
    </Card>
  )
}
