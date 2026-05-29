'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Wallet, Coins, ArrowUpRight, HelpCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function WalletPayoutPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [bankName, setBankName] = useState('Bank Central Asia (BCA)')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
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

    setTimeout(() => {
      setIsSaving(false)
      setMessage('Rekening bank pencairan dana berhasil diperbarui!')
    }, 800)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Memuat saldo dompet...</p>
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
            <h1 className="text-base font-black text-slate-800 tracking-tight">Informasi Dompet & Pencairan</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelola hasil penjualan pangan surplus</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-6">
        {/* Wallet Balance Card */}
        <Card className="p-6 border border-slate-100 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md rounded-2xl relative overflow-hidden">
          {/* Decorative watermark icon */}
          <div className="absolute -right-6 -bottom-6 text-white/10 opacity-30 pointer-events-none">
            <Wallet className="w-40 h-40" />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-100/90">Saldo Penjualan</span>
              <p className="text-3xl font-black mt-1 tracking-tight">Rp 0</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => alert('Saldo Anda masih Rp 0. Tidak ada dana untuk dicairkan saat ini.')}
              className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold rounded-xl py-2.5 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Tarik Saldo</span>
            </Button>
          </div>
        </Card>

        {/* Bank Account Config Form */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-50">
            <h3 className="font-extrabold text-slate-800 text-sm">Rekening Bank Tujuan</h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
              Pencairan Otomatis
            </span>
          </div>

          {message && (
            <div className="p-4 rounded-xl mb-6 text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Bank Name Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="bankName" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Nama Bank
              </label>
              <select
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
              >
                <option value="Bank Central Asia (BCA)">BCA (Bank Central Asia)</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank Rakyat Indonesia (BRI)">BRI (Bank Rakyat Indonesia)</option>
                <option value="Bank Negara Indonesia (BNI)">BNI (Bank Negara Indonesia)</option>
                <option value="Gopay">E-Wallet Gopay</option>
                <option value="OVO">E-Wallet OVO</option>
              </select>
            </div>

            {/* Account Number Input */}
            <div className="space-y-1.5">
              <label htmlFor="accountNumber" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Nomor Rekening / HP E-Wallet
              </label>
              <input
                id="accountNumber"
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Masukkan nomor rekening tanpa tanda strip"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Account Holder Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="accountHolder" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Nama Pemilik Rekening (Sesuai Buku Tabungan)
              </label>
              <input
                id="accountHolder"
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Rekening'}</span>
            </Button>
          </form>
        </Card>

        {/* Withdrawal Info */}
        <Card className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl flex gap-3 text-xs leading-relaxed font-medium text-slate-500">
          <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-slate-800 mb-0.5">Informasi Pencairan Hasil</h4>
            <p>
              Hasil penjualan makanan surplus akan langsung dikumpulkan ke Saldo Penjualan Anda. Pencairan dana diproses secara aman dalam waktu 1x24 jam kerja ke rekening terdaftar.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
