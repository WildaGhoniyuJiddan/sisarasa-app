import { Sparkles, TrendingUp, ArrowRight, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface AIPrediction {
  id: string
  menuName: string
  predictedSurplus: number
  confidence: number
  recommendation: string
  basedOn: string
}

interface AISurplusPredictorCardProps {
  predictions: AIPrediction[]
}

export default function AISurplusPredictorCard({ predictions }: AISurplusPredictorCardProps) {
  const topPrediction = predictions[0]

  if (!topPrediction) {
    return (
      <Card className="p-6 border border-emerald-100 bg-emerald-50/20 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-emerald-800 tracking-tight">AI Surplus Predictor</h3>
            <p className="text-xs text-emerald-600/80 font-bold uppercase tracking-wider">Analitik Prediktif Pintar</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Belum ada analisis penjualan yang cukup. Sistem AI kami sedang mengumpulkan data historis warung Anda.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 border border-emerald-100 bg-emerald-50/30 rounded-2xl relative overflow-hidden shadow-sm">
      {/* Glow Ambient Light */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm animate-pulse-slow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-emerald-800 tracking-tight">AI Surplus Predictor</h3>
            <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">Bertenaga Kecerdasan Buatan SisaRasa</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <Badge variant="secondary" className="w-fit bg-emerald-100/80 hover:bg-emerald-100 text-emerald-800 border-none rounded-full px-3 py-1 font-bold text-xs tracking-tight flex items-center gap-1.5 self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{Math.round(topPrediction.confidence * 100)}% akurat</span>
        </Badge>
      </div>

      {/* Prediction Content */}
      <div className="space-y-5">
        {/* Main Recommendation inside Alert block */}
        <Alert className="border-emerald-100 bg-white p-5 rounded-xl shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <AlertTitle className="text-emerald-800 font-extrabold text-sm tracking-tight mb-1.5">
            Saran AI untuk <span className="text-emerald-600 underline decoration-2 underline-offset-2">{topPrediction.menuName}</span>
          </AlertTitle>
          <AlertDescription className="text-slate-600 leading-relaxed text-sm font-medium">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
                Prediksi Surplus: {topPrediction.predictedSurplus} Porsi
              </span>
            </div>
            {topPrediction.recommendation}
          </AlertDescription>
        </Alert>

        {/* Based On Info */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Info className="w-4 h-4 text-slate-300 shrink-0" />
          <span>{topPrediction.basedOn}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="sm"
            onClick={() => {
              alert('Fitur Siapkan Promo Dinamis akan segera hadir!')
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-5 py-2 flex items-center gap-2 shadow-sm text-xs tracking-wider uppercase"
          >
            <span>Siapkan Promo</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert('Menampilkan daftar rekomendasi surplus menu lainnya...')
            }}
            className="border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl font-bold px-5 py-2 text-xs tracking-wider uppercase"
          >
            Lihat Prediksi Lainnya
          </Button>
        </div>
      </div>
    </Card>
  )
}
