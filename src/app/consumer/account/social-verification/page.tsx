'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, ShieldCheck, UploadCloud, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SocialVerificationPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'consumer')) {
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
            onClick={() => router.push('/consumer/marketplace')}
            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight">Verifikasi ID Sosial</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verifikasi kelayakan donasi sosial</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-6">
        {/* Verification Status Card */}
        <Card className="p-6 border border-emerald-100 bg-white shadow-sm rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 relative">
            <ShieldCheck className="w-10 h-10 animate-pulse-slow" />
          </div>

          <Badge className="bg-emerald-600 text-white rounded-full font-black text-[9px] tracking-wider px-3 py-1 uppercase shadow-sm">
            STATUS: TERVERIFIKASI (PENERIMA MANFAAT)
          </Badge>

          <h2 className="text-base font-black text-slate-800 tracking-tight mt-4 mb-2">
            Akses Donasi Makanan Gratis Aktif
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
            Selamat! Profil Anda terverifikasi sebagai penerima donasi pangan sosial SisaRasa untuk mengklaim surplus hidangan secara gratis.
          </p>
        </Card>

        {/* Identity File Upload Dropzone Placeholder */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="font-extrabold text-slate-800 text-sm">Dokumen Pendukung Verifikasi</h3>
          </div>

          {/* Upload Box (Passive Dropzone Placeholder) */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
              <UploadCloud className="w-5 h-5 text-emerald-600 animate-bounce-slow" />
            </div>
            <p className="text-xs font-extrabold text-slate-800">kartu_identitas_panti.png</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Diverifikasi Otomatis Oleh Admin</p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-semibold leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Verifikasi kartu identitas panti asuhan/dhuafa aktif dan diperbarui secara berkala.</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
