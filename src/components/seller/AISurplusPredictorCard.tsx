import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import TactileButton from '@/components/ui/TactileButton'

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
      <div className="bento-card bento-card-wide border-2 border-accent-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-accent-primary">AI Surplus Predictor</h3>
            <p className="text-sm text-outline">Prediksi berbasis kecerdasan buatan</p>
          </div>
        </div>
        <p className="text-sm text-outline">Belum ada prediksi tersedia. Sistem sedang menganalisis data penjualan Anda.</p>
      </div>
    )
  }

  return (
    <div className="bento-card bento-card-wide border-2 border-accent-primary/30 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center animate-pulse-slow">
            <Sparkles className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-accent-primary">AI Surplus Predictor</h3>
            <p className="text-xs text-outline">Prediksi berbasis kecerdasan buatan</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="px-3 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/30">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-bold text-accent-primary">
              {Math.round(topPrediction.confidence * 100)}% akurat
            </span>
          </div>
        </div>
      </div>

      {/* Prediction Content */}
      <div className="space-y-4">
        {/* Main Recommendation */}
        <div className="p-4 rounded-xl bg-surface-container-high border border-accent-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-lg font-black text-bg-primary">
                {topPrediction.predictedSurplus}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface-variant mb-1">
                Saran AI untuk <span className="text-accent-primary">{topPrediction.menuName}</span>:
              </p>
              <p className="text-sm text-outline leading-relaxed">
                {topPrediction.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Based On Info */}
        <div className="flex items-center gap-2 text-xs text-outline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{topPrediction.basedOn}</span>
        </div>

        {/* Action Button */}
        <div className="flex gap-3 pt-2">
          <TactileButton
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              // TODO: Navigate to promo setup or pricing page
              alert('Fitur Siapkan Promo akan segera hadir!')
            }}
          >
            <span>Siapkan Promo</span>
            <ArrowRight className="w-4 h-4" />
          </TactileButton>

          <button
            type="button"
            className="px-4 py-2 rounded-full border border-outline/30 text-sm font-semibold text-outline hover:border-accent-primary/50 hover:text-accent-primary transition-all duration-200 focus-visible-ring"
            onClick={() => {
              // TODO: Show all predictions
              alert('Menampilkan semua prediksi AI')
            }}
          >
            Lihat Semua Prediksi
          </button>
        </div>
      </div>

      {/* Additional Predictions Count */}
      {predictions.length > 1 && (
        <div className="mt-4 pt-4 border-t border-outline/20">
          <p className="text-xs text-outline">
            +{predictions.length - 1} prediksi lainnya tersedia
          </p>
        </div>
      )}
    </div>
  )
}
