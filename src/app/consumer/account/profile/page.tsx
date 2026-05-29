'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, User, Mail, Phone, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ConsumerProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [fullName, setFullName] = useState('boruto')
  const [email, setEmail] = useState('jiddanbeli@gmail.com')
  const [phone, setPhone] = useState('6281298765432')
  
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'consumer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  // Set default placeholder based on authenticated user if present
  useEffect(() => {
    if (user) {
      setFullName(user.username || 'boruto')
      setEmail(user.email || 'jiddanbeli@gmail.com')
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg(null)

    setTimeout(() => {
      setIsSaving(false)
      setSuccessMsg('Profil Anda berhasil diperbarui secara lokal!')
    }, 800)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Memuat profil...</p>
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
            <h1 className="text-base font-black text-slate-800 tracking-tight">Detail Profil</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelola preferensi akun personal Anda</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8">
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm">Informasi Personal</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Edit nama dan kontak</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl mb-6 text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Boruto Uzumaki"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Alamat Email</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: boruto@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Nomor Handphone</span>
              </label>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 6281298765432"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
