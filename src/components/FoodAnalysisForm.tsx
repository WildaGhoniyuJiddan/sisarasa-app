'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Camera,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Tag,
  Package,
  TrendingDown,
  Send
} from 'lucide-react'
import { analyzeFood, SmartEntryResult, createProduct } from '@/services/api'
import { useAuth } from '@/lib/auth-context'

type WizardStep = 'upload' | 'review' | 'publishing'

export default function FoodAnalysisForm() {
  const router = useRouter()
  const { user, token } = useAuth()

  // --- Step state ---
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload')

  // --- Upload step ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [normalPrice, setNormalPrice] = useState<string>('')
  const [portions, setPortions] = useState<string>('')
  const [isDragActive, setIsDragActive] = useState(false)

  // --- Analysis step ---
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SmartEntryResult | null>(null)
  
  // --- Publishing step ---
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  // --- Shared ---
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // --- File handlers ---
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPEG, PNG, WebP).')
      return
    }
    setError(null)
    setAnalysisResult(null)
    setSelectedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }
  const triggerFileInput = () => fileInputRef.current?.click()

  const resetForm = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setNormalPrice('')
    setPortions('')
    setAnalysisResult(null)
    setError(null)
    setCurrentStep('upload')
    setPublishSuccess(false)
  }

  // --- Step 1 → Step 2: Analyze ---
  const handleAnalyze = async () => {
    if (!selectedFile) return
    const priceNum = parseInt(normalPrice)
    const portionsNum = parseInt(portions)
    if (!priceNum || priceNum <= 0) { setError('Masukkan harga normal yang valid.'); return }
    if (!portionsNum || portionsNum <= 0) { setError('Masukkan jumlah porsi yang valid.'); return }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const result = await analyzeFood(selectedFile, priceNum, portionsNum)
      setAnalysisResult(result)
      setCurrentStep('review')
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis makanan.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // --- Step 3: Publish ---
  const handlePublish = async () => {
    if (!analysisResult) return
    setIsPublishing(true)
    setError(null)
    setCurrentStep('publishing')

    try {
      if (!token) {
        throw new Error('Sesi Anda telah kedaluwarsa. Silakan login kembali.')
      }
      
      await createProduct(
        {
          name: analysisResult.food_name,
          normalPrice: analysisResult.normal_price,
          currentPrice: analysisResult.suggested_selling_price,
          hppFloor: Math.round(analysisResult.normal_price * 0.5), // 50% HPP Limit dari PRD
          sellerId: user?.id || '',
          status: 'active',
          photoUrl: analysisResult.photo_url || '',
          portions: analysisResult.portions || 1,
        },
        token,
      )

      setPublishSuccess(true)
      // Redirect after 2 seconds
      setTimeout(() => router.push('/seller/dashboard'), 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Gagal mempublikasikan produk surplus.')
      setCurrentStep('review')
    } finally {
      setIsPublishing(false)
    }
  }

  // --- Format currency ---
  const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

  // --- Step indicators ---
  const steps = [
    { key: 'upload', label: 'Upload & Input', icon: Camera },
    { key: 'review', label: 'Review Harga AI', icon: TrendingDown },
    { key: 'publishing', label: 'Publikasi', icon: Send },
  ] as const

  const stepIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="px-6 pt-6 md:px-8 md:pt-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, i) => {
              const StepIcon = step.icon
              const isActive = i === stepIndex
              const isDone = i < stepIndex || publishSuccess
              return (
                <React.Fragment key={step.key}>
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isDone ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-emerald-500/20 text-emerald-600 ring-2 ring-emerald-500' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}>{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 rounded transition-all duration-500 ${
                      i < stepIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* ============ STEP 1: Upload & Input ============ */}
        {currentStep === 'upload' && (
          <div className="px-6 pb-8 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Upload Zone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  📸 Foto Makanan Surplus
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={!previewUrl ? triggerFileInput : undefined}
                  className={`relative flex flex-col items-center justify-center min-h-[220px] p-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    previewUrl 
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50' 
                      : isDragActive
                      ? 'border-emerald-500 bg-emerald-500/5 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 dark:border-slate-700 bg-slate-50/50 cursor-pointer'
                  }`}
                >
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*" className="hidden" />

                  {previewUrl ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden group shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" onClick={triggerFileInput} className="p-3 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg active:scale-95" title="Ganti"><Camera className="w-5 h-5" /></button>
                        <button type="button" onClick={resetForm} className="p-3 bg-rose-500/90 hover:bg-rose-500 text-white rounded-full shadow-lg active:scale-95" title="Hapus"><XCircle className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Drag & drop foto, atau <span className="text-emerald-500 hover:underline">pilih file</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP (Maks. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Price & Portions Input */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-1.5 text-emerald-500" />
                    Harga Normal Menu (Rp)
                  </label>
                  <input
                    type="number"
                    value={normalPrice}
                    onChange={(e) => setNormalPrice(e.target.value)}
                    placeholder="Contoh: 25000"
                    min={1000}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">Harga sebelum diskon surplus yang biasa Anda jual</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Package className="w-4 h-4 inline mr-1.5 text-emerald-500" />
                    Jumlah Porsi Tersisa
                  </label>
                  <input
                    type="number"
                    value={portions}
                    onChange={(e) => setPortions(e.target.value)}
                    placeholder="Contoh: 5"
                    min={1}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">Berapa banyak porsi yang masih tersedia saat ini</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 border border-rose-100 rounded-xl text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !normalPrice || !portions || isAnalyzing}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isAnalyzing ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Menganalisis dengan AI...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Analisis & Tentukan Harga AI</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 2: Review Pricing ============ */}
        {currentStep === 'review' && analysisResult && (
          <div className="px-6 pb-8 md:px-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Photo + Detected Info */}
              <div className="space-y-4">
                {previewUrl && (
                  <div className="relative rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt={analysisResult.food_name} className="w-full aspect-video object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        analysisResult.freshness_estimation === 'Fresh' ? 'bg-emerald-500 text-white' :
                        analysisResult.freshness_estimation === 'Good' ? 'bg-blue-500 text-white' :
                        analysisResult.freshness_estimation === 'Critical' ? 'bg-amber-500 text-white' :
                        'bg-rose-500 text-white'
                      }`}>{analysisResult.freshness_estimation}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-black/60 text-white text-xs font-bold rounded-full">
                        {Math.round(analysisResult.confidence_score * 100)}% akurasi
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terdeteksi oleh AI</p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{analysisResult.food_name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysisResult.description}</p>
                  <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {analysisResult.portions} porsi</span>
                  </div>
                </div>
              </div>

              {/* Right: Pricing Card */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Saran Harga AI</h4>
                  </div>

                  {/* Normal Price (strikethrough) */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-slate-500">Harga Normal</span>
                    <span className="text-lg text-slate-400 line-through font-medium">{formatRp(analysisResult.normal_price)}</span>
                  </div>

                  {/* Discount Badge */}
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-bold shadow-md">
                      DISKON {analysisResult.discount_percentage}%
                    </div>
                  </div>

                  {/* Suggested Selling Price */}
                  <div className="flex items-baseline justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Harga Jual Surplus</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatRp(analysisResult.suggested_selling_price)}</span>
                  </div>

                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    Anda menghemat {formatRp(analysisResult.normal_price - analysisResult.suggested_selling_price)} per porsi untuk konsumen
                  </p>
                </div>

                {/* AI Justification */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">💡 Pertimbangan AI</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysisResult.pricing_justification}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setCurrentStep('upload'); setAnalysisResult(null) }}
                    className="flex-shrink-0 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl active:scale-[0.98] transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all"
                  >
                    <Send className="w-5 h-5" />
                    Setuju & Publikasikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 3: Publishing / Success ============ */}
        {currentStep === 'publishing' && (
          <div className="px-6 pb-8 md:px-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
              {publishSuccess ? (
                <>
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Produk Berhasil Dipublikasikan! 🎉
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    <strong>{analysisResult?.food_name}</strong> sekarang tersedia di marketplace
                    dengan harga <strong>{analysisResult ? formatRp(analysisResult.suggested_selling_price) : ''}</strong>.
                  </p>
                  <p className="text-xs text-slate-400">Mengalihkan ke Dashboard...</p>
                </>
              ) : (
                <>
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <Send className="w-6 h-6 text-emerald-500 absolute animate-pulse" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Mempublikasikan ke Marketplace...
                  </h3>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
