'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockMarketplaceProducts } from '@/lib/mock-data'
import { Product } from '@/types'
import { getHoursSince, getFreshnessStatus } from '@/lib/utils'
import { ArrowLeft, Sparkles, MapPin, Clock, ShieldCheck, QrCode, FileText, CheckCircle2, ChevronRight, Info, Camera, Gift, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function ClaimDonationPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  
  // Form State
  const [agreed, setAgreed] = useState<boolean>(false)
  const [idUploaded, setIdUploaded] = useState<boolean>(false)
  
  // Navigation State
  const [isSuccess, setIsSuccess] = useState<boolean>(false) // Shows QR Code
  const [isHandingOver, setIsHandingOver] = useState<boolean>(false) // Shows Handover Photo Upload Form
  const [isFullyCompleted, setIsFullyCompleted] = useState<boolean>(false) // Shows final congratulatory impact screen
  
  const [claimCode, setClaimCode] = useState<string>('')

  // Handover Form State
  const [handoverPhotoUploaded, setHandoverPhotoUploaded] = useState<boolean>(false)
  const [recipientName, setRecipientName] = useState<string>('')

  // Redirect if not authenticated or not a consumer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'consumer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  // Fetch product details
  useEffect(() => {
    if (params?.id) {
      const found = mockMarketplaceProducts.find((p) => p.id === params.id)
      if (found) {
        setProduct(found)
      } else {
        alert('Produk tidak ditemukan!')
        router.push('/consumer/marketplace')
      }
    }
  }, [params, router])

  const handleConfirmClaim = () => {
    if (!agreed) {
      alert('Anda harus menyetujui pernyataan kelayakan konsumsi.')
      return
    }
    if (!idUploaded) {
      alert('Tolong unggah foto identitas untuk verifikasi anti-hoarding.')
      return
    }

    const rand = Math.floor(1000 + Math.random() * 9000)
    setClaimCode(`SR-CLAIM-${rand}`)
    setIsSuccess(true)
  }

  const handleGoToHandover = () => {
    setIsHandingOver(true)
  }

  const handleSubmitHandover = () => {
    if (!handoverPhotoUploaded) {
      alert('Tolong ambil/unggah foto bukti penyerahan makanan.')
      return
    }
    if (!recipientName.trim()) {
      alert('Tolong tuliskan keterangan penerima manfaat (misal: Tunawisma perempatan atau Panti Asuhan).')
      return
    }
    setIsFullyCompleted(true)
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-outline">Memuat detail klaim...</p>
        </div>
      </div>
    )
  }

  const hoursSince = getHoursSince(product.cookedAt)
  const freshnessStatus = getFreshnessStatus(hoursSince)

  // -------------------------------------------------------------
  // STATE 4: CLAIM FULLY COMPLETED (SUCCESS VERIFIED SOCIAL ACT)
  // -------------------------------------------------------------
  if (isFullyCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center px-4">
          <h1 className="text-md font-extrabold text-slate-800 mx-auto">Klaim Selesai!</h1>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 animate-pulse">
              <Gift className="w-10 h-10" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-2">
              AKSI SOSIAL TERVERIFIKASI
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Terima Kasih, {user?.username}!</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Anda adalah pahlawan sosial penyelamat pangan hari ini.</p>
          </div>

          {/* Social Proof Success Receipt */}
          <Card className="p-6 border border-slate-100 bg-white shadow-md rounded-3xl space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl bg-emerald-50/10 border border-emerald-100 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-600/5 flex flex-col items-center justify-center p-4">
                <Badge className="bg-emerald-600 text-white font-extrabold shadow-sm rounded-full px-3 py-1 mb-2">
                  ✓ FOTO BUKTI TERVERIFIKASI
                </Badge>
                <Heart className="w-8 h-8 text-[#FF4D4D] fill-[#FF4D4D] animate-pulse mb-1" />
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Penyerahan Pangan Sukses</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">SisaRasa TrustEngine™</span>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Penerima Manfaat</span>
                <span className="text-emerald-700 font-black">TERIMA KASIH</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-500">Target Distribusi:</span>
                <span className="font-black text-slate-800 text-right truncate max-w-[200px]">{recipientName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-500">Penyalur (Volunteer):</span>
                <span className="font-black text-slate-800">{user?.username}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dampak Ekologi Makanan</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full">+50 POIN SOSIAL</span>
              </div>
            </div>
          </Card>

          {/* Social Impact Highlight */}
          <Card className="p-4 bg-emerald-50/20 border border-emerald-50/50 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Laporan Dampak Aksi</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                Aksi sosial ini menyelamatkan <strong>0.35 kg limbah pangan</strong>, mengurangi karbon <strong>0.88 kg CO₂</strong>, dan mencerahkan hari saudara kita!
              </p>
            </div>
          </Card>
        </main>

        <div className="px-4 max-w-md mx-auto w-full">
          <Button
            onClick={() => router.push('/consumer/marketplace')}
            className="w-full bg-slate-850 hover:bg-slate-900 text-white font-extrabold py-5 rounded-2xl shadow-sm transition-all"
          >
            Kembali ke Marketplace
          </Button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STATE 3: PHOTO HANDOVER UPLOAD FORM (NEW STEP REQUESTED)
  // -------------------------------------------------------------
  if (isHandingOver) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setIsHandingOver(false)}
            className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-md font-extrabold text-slate-800">Bukti Penyerahan</h1>
          <div className="w-10" />
        </header>

        <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
          {/* Headline guidance */}
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Dokumentasi Aksi Sosial</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Sebagai jaminan transparansi donasi surplus makanan, mohon unggah foto momen penyerahan masakan kepada penerima.
            </p>
          </div>

          {/* Photo Capture Uploader Box */}
          <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Langkah 1: Unggah Foto Dokumentasi</h4>
            
            <div
              onClick={() => setHandoverPhotoUploaded(true)}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                handoverPhotoUploaded
                  ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800'
                  : 'border-slate-200 hover:border-emerald-350 hover:bg-slate-50/50 text-slate-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border ${
                handoverPhotoUploaded ? 'bg-emerald-100/50 border-emerald-250 text-emerald-700' : 'bg-slate-100 border-slate-150 text-slate-500'
              }`}>
                <Camera className="w-6 h-6" />
              </div>

              {handoverPhotoUploaded ? (
                <div>
                  <span className="text-xs font-extrabold block text-emerald-800">Foto Penyerahan Terambil!</span>
                  <span className="text-[10px] text-emerald-600 font-medium">handover_food_moment.jpg (Verified ✓)</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold block text-slate-700">Ambil Foto Bukti Penyerahan</span>
                  <span className="text-[10px] text-slate-400 font-medium">Buka Kamera / Pilih file foto</span>
                </div>
              )}
            </div>
          </Card>

          {/* Beneficiary Target Description Input */}
          <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Langkah 2: Detail Penerima Manfaat</h4>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Siapa atau di mana donasi diserahkan?</label>
              <Input
                type="text"
                placeholder="Misal: Ibu Aminah (Tunawisma Jl. Dipatiukur)"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="rounded-xl border-slate-200 text-sm font-semibold p-4 focus:ring-emerald-500"
              />
            </div>
          </Card>
        </main>

        {/* Submit Actions */}
        <div className="px-4 max-w-md mx-auto w-full">
          <Button
            onClick={handleSubmitHandover}
            disabled={!handoverPhotoUploaded || !recipientName.trim()}
            className={`w-full font-black py-6 rounded-2xl shadow-lg transition-all ${
              handoverPhotoUploaded && recipientName.trim()
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Kirim & Selesaikan Aksi Sosial
          </Button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STATE 2: SUCCESS VIEW (SHOWS STORE QR VOUCHER FOR VOLUNTEER)
  // -------------------------------------------------------------
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center px-4">
          <h1 className="text-md font-extrabold text-slate-800 mx-auto">Klaim Berhasil!</h1>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
          {/* Animated Confirmation Badge */}
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Klaim Pangan Terpesan</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Langkah 1 dari 2: Ambil makanan surplus di warung mitra</p>
          </div>

          {/* QR Code Card */}
          <Card className="p-6 border border-slate-100 bg-white shadow-md rounded-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TERVERIFIKASI SISTEM</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 inline-block">
              <QrCode className="w-40 h-40 text-slate-800 mx-auto" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kode Klaim Anda</p>
              <p className="text-lg font-black text-emerald-600 tracking-tight mt-0.5">{claimCode}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 text-left space-y-3">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lokasi Warung Ambil</p>
                  <p className="text-sm font-extrabold text-slate-800">{product.sellerName}</p>
                  <p className="text-xs text-slate-400 font-medium">Radius {product.distance ? `${product.distance / 1000} km` : '1.2 km'} dari Anda</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Batas Jam Pengambilan</p>
                  <p className="text-sm font-extrabold text-slate-800">Hari ini, Maksimal 3 jam dari sekarang</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Proof Info Banner */}
          <Card className="p-4 bg-amber-50/20 border border-amber-100/40 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider">Penting: Langkah Dokumentasi</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                Setelah mengambil makanan ini dari mitra warung, Anda diwajibkan mengunggah foto penyerahan donasi kepada yang berhak sebelum status aksi sosial Anda dinyatakan selesai.
              </p>
            </div>
          </Card>
        </main>

        {/* Primary Action redirects to photo proof step */}
        <div className="px-4 max-w-md mx-auto w-full">
          <Button
            onClick={handleGoToHandover}
            className="w-full bg-[#10B981] hover:bg-emerald-650 text-white font-black py-6 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Lanjutkan Unggah Bukti Penyerahan</span>
            <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STATE 1: INITIAL CLAIM CONFIRMATION PAGE (ID + AGREEMENT CHECK)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center justify-between px-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-md font-extrabold text-slate-800">Konfirmasi Klaim</h1>
        <div className="w-10" />
      </header>

      {/* Main Form Content */}
      <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Item Detail Card */}
        <Card className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-black">
              DS
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-black tracking-wider uppercase">
                DONASI GRATIS
              </span>
              <h3 className="text-base font-black text-slate-800 truncate tracking-tight mt-1">{product.name}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{product.sellerName}</p>

              <div className="flex items-center gap-2 mt-2">
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
                <span className="text-xs text-slate-400 font-medium">
                  {product.availablePortions} porsi tersedia
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Identity Verification System (Anti-Hoarding) */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl space-y-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Sosial Anti-Hoarding</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Untuk memastikan keadilan bagi warga yang membutuhkan, harap unggah kartu identitas (KTP/KIA/Keluarga Sejahtera).
            </p>
          </div>

          <div 
            onClick={() => setIdUploaded(true)}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
              idUploaded 
                ? 'border-emerald-200 bg-emerald-50/20 text-emerald-700' 
                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 text-slate-400'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-500">
              <FileText className={`w-5 h-5 ${idUploaded ? 'text-emerald-600' : ''}`} />
            </div>
            {idUploaded ? (
              <div>
                <span className="text-xs font-extrabold block">Identitas Terunggah!</span>
                <span className="text-[10px] text-emerald-600/80 font-medium">ktp_penerima_bansos.png</span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold block text-slate-600">Klik untuk upload Foto Kartu Identitas</span>
                <span className="text-[10px] text-slate-400 font-medium">Format JPEG, PNG maks 4MB</span>
              </div>
            )}
          </div>
        </Card>

        {/* Portions Rules */}
        <Card className="p-4 bg-amber-50/20 border border-amber-100/50 rounded-2xl flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed font-medium">
            <strong>Aturan Donasi Sosial SisaRasa:</strong> Klaim donasi sosial gratis dibatasi maksimal 1 porsi per keluarga per hari guna menjaga pemerataan bantuan sosial.
          </div>
        </Card>

        {/* Consumability & Responsibility Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
          />
          <div className="text-xs font-medium text-slate-500 leading-relaxed">
            Saya setuju bahwa saya adalah penerima manfaat yang sah, bersedia memakan porsi ini secara bertanggung jawab, dan mengonfirmasi bahwa produk ini tidak mengandung unsur yang melanggar pantangan diet saya.
          </div>
        </label>
      </main>

      {/* Persistent Bottom Confirm Bar */}
      <div className="px-4 max-w-md mx-auto w-full">
        <Button
          onClick={handleConfirmClaim}
          disabled={!agreed || !idUploaded}
          className={`w-full font-black py-6 rounded-2xl shadow-lg transition-all ${
            agreed && idUploaded
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-500/10 hover:shadow-emerald-500/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Klaim Donasi Sekarang (Gratis)
        </Button>
      </div>
    </div>
  )
}
