import { Leaf, Package, TrendingUp, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

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
    <div className="bento-card bento-card-tall bg-gradient-to-br from-accent-primary/10 to-surface-container border-2 border-accent-primary/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center">
          <Leaf className="w-6 h-6 text-bg-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-accent-primary">Dampak Sosial</h3>
          <p className="text-xs text-outline">Kontribusi Anda</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="space-y-6">
        {/* Waste Saved - Primary Metric */}
        <div className="p-4 rounded-xl bg-accent-primary/20 border border-accent-primary/30">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-black text-accent-primary">
              {stats.totalWasteSaved.toFixed(1)}
            </span>
            <span className="text-lg font-bold text-accent-primary">kg</span>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant">
            Total Limbah Makanan Terselamatkan
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-outline">
            <Package className="w-4 h-4" />
            <span>≈ {stats.totalPortionsSaved} porsi makanan</span>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue */}
          <div className="p-4 rounded-xl bg-surface-container-high border border-outline/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-fresh-mint/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-fresh-mint" />
              </div>
            </div>
            <p className="text-lg font-black text-fresh-mint">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-outline mt-1">Total Pendapatan</p>
          </div>

          {/* Active Products */}
          <div className="p-4 rounded-xl bg-surface-container-high border border-outline/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-warning-mint/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-warning-mint" />
              </div>
            </div>
            <p className="text-lg font-black text-warning-mint">
              {stats.activeProducts}
            </p>
            <p className="text-xs text-outline mt-1">Produk Aktif</p>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="p-4 rounded-xl bg-surface-container border border-outline/20">
          <p className="text-xs font-semibold text-on-surface-variant mb-2">
            Dampak Lingkungan:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-outline">Pengurangan CO₂</span>
              <span className="font-bold text-accent-primary">
                ≈ {(stats.totalWasteSaved * 2.5).toFixed(1)} kg
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-outline">Setara dengan</span>
              <span className="font-bold text-accent-primary">
                {Math.round(stats.totalWasteSaved * 0.5)} pohon ditanam
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-accent-primary/20 to-fresh-mint/20 border border-accent-primary/30 text-center">
          <div className="text-2xl mb-1">🌱</div>
          <p className="text-sm font-bold text-accent-primary">
            Pahlawan Lingkungan
          </p>
          <p className="text-xs text-outline mt-1">
            Terus berkontribusi untuk Indonesia yang lebih hijau!
          </p>
        </div>
      </div>
    </div>
  )
}
