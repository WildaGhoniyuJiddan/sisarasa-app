'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Clock, Save, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function OperationalHoursPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [startTime, setStartTime] = useState('17:00')
  const [endTime, setEndTime] = useState('21:00')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    // Trigger state logging as requested
    console.log(`[Jam Operasional Ambil] Saved: Start = ${startTime}, End = ${endTime} for store owner user.id = ${user?.id}`)

    setTimeout(() => {
      setIsSaving(false)
      setMessage('Jam operasional pengambilan berhasil dikonfigurasi!')
    }, 800)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Memuat pengaturan...</p>
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
            <h1 className="text-base font-black text-slate-800 tracking-tight">Jam Operasional Ambil</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Batas waktu penyerahan pangan surplus</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8">
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm">Waktu Penyerahan</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Batas jam operasional toko</p>
            </div>
          </div>

          {message && (
            <div className="p-4 rounded-xl mb-6 text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="startTime" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Mulai Pengambilan
                </label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
                >
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00 (Sore)</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="endTime" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Batas Akhir (Tutup)
                </label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
                >
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00 (Malam)</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
              </div>
            </div>

            {/* Informational Guidance */}
            <div className="p-4 rounded-xl bg-emerald-50/20 border border-emerald-100/20 flex gap-3 text-xs leading-relaxed font-medium text-slate-500">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Konsumen disarankan melakukan pengambilan pesanan pada rentang waktu operasional yang Anda tentukan 
                untuk menjamin kualitas kesegaran pangan surplus tetap dalam keadaan prima.
              </p>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
