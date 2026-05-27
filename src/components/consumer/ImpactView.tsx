'use client'

import { Leaf, Heart, Coins, Trophy, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ImpactView() {
  // Mock data for consumer impact
  const stats = {
    mealsSaved: 8,
    wasteSavedKg: 2.4, // kg of waste prevented
    co2Reduced: 6.0, // kg of CO2 offset
    moneySaved: 75000, // Rp saved
    treesEquivalent: 1, // setara pohon
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Dampak Hijau Anda</h2>
        <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Kontribusi penyelamatan lingkungan Anda</p>
      </div>

      {/* Main Metric - Waste Saved */}
      <Card className="p-5 border border-emerald-100 bg-emerald-50/20 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-emerald-800 tracking-tight uppercase">Carbon Offset</h3>
            <p className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-wider">Setara pengurangan emisi karbon</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl font-black text-emerald-600 tracking-tighter">
            {stats.co2Reduced.toFixed(1)}
          </span>
          <span className="text-xl font-extrabold text-emerald-700">kg CO₂</span>
        </div>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          Hebat! Anda telah mencegah potensi emisi gas rumah kaca dengan meminimalkan pemborosan pangan.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Portions Saved */}
        <Card className="p-4 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Porsi Diselamatkan</span>
          </div>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            {stats.mealsSaved} Porsi
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Setara {stats.wasteSavedKg} kg sisa pangan</p>
        </Card>

        {/* Cost Savings */}
        <Card className="p-4 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Penghematan</span>
          </div>
          <p className="text-xl font-black text-slate-800 tracking-tight">
            Rp {stats.moneySaved.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Dari diskon surplus pangan</p>
        </Card>
      </div>

      {/* Environmental Hero Badge */}
      <Card className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-100/30 text-center shadow-inner">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
          <Trophy className="w-6 h-6" />
        </div>
        <p className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Penyelamat Pangan Hijau</span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium mt-1.5 max-w-xs mx-auto leading-relaxed">
          Setara dengan kontribusi penanaman <strong>{stats.treesEquivalent} Pohon Hijau</strong> untuk menetralisir karbon udara secara mandiri!
        </p>
      </Card>
    </div>
  )
}
