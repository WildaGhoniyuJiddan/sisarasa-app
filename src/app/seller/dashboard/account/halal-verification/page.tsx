'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, ShieldCheck, Award, FileText, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HalalVerificationPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Memuat status verifikasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/seller/dashboard')}
            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight">Sertifikasi Kehalalan Pangan</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status kelayakan pangan UMKM</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-6">
        {/* Verification Status Card */}
        <Card className="p-6 border border-slate-100 bg-white shadow-sm rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 relative">
            <ShieldCheck className="w-10 h-10 animate-pulse-slow" />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black border border-white">
              ✓
            </span>
          </div>

          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-black text-[10px] tracking-wider px-3 py-1 uppercase shadow-sm">
            Terverifikasi Premium
          </Badge>

          <h2 className="text-lg font-black text-slate-800 tracking-tight mt-4 mb-2">
            Warung {user?.username} Lolos Kurasi Halal
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            Warung Anda telah diverifikasi oleh tim penilai SisaRasa sebagai penyedia produk kuliner surplus halal, higienis, dan layak konsumsi.
          </p>
        </Card>

        {/* Decorative Certificate Viewer */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="font-extrabold text-slate-800 text-sm">Dokumen Sertifikat Digital</h3>
          </div>

          {/* Placeholders */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-100/50 text-emerald-600 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-xs font-extrabold text-slate-800">SERTIFIKAT_HALAL_SR_{user?.id?.slice(0, 8)?.toUpperCase()}.pdf</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Status: AKTIF DIPASARKAN</p>
            
            {/* Watermark badge */}
            <div className="absolute top-2 right-2">
              <span className="bg-emerald-600 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded tracking-wider shadow-sm">
                PREMIUM
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Verifikasi kelayakan otomatis terbit sejak pendaftaran merchant.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Sertifikasi ini ditampilkan pada detail warung di halaman konsumen untuk meningkatkan reputasi kepercayaan beli.</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
