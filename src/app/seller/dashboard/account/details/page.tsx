'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Store, MapPin, Phone, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getStoreDetail, updateStore } from '@/services/api'

export default function StoreDetailsPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading } = useAuth()
  
  const [storeName, setStoreName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('-6.2088')
  const [longitude, setLongitude] = useState('106.8456')
  const [whatsapp, setWhatsapp] = useState('')
  
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  // Fetch Store Profile details on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsFetching(false)
      return
    }

    const fetchStore = async () => {
      try {
        setIsFetching(true)
        const storeData = await getStoreDetail(user.id)
        setStoreName(storeData.store_name)
        setAddress(storeData.address)
        setLatitude(storeData.latitude.toString())
        setLongitude(storeData.longitude.toString())
        setWhatsapp(storeData.phone || '')
      } catch (err: any) {
        console.error('Error fetching store details:', err)
        setMessage({ type: 'error', text: 'Gagal mengambil detail warung dari server.' })
      } finally {
        setIsFetching(false)
      }
    }

    fetchStore()
  }, [isAuthenticated, user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !user) return

    setIsSaving(true)
    setMessage(null)

    try {
      await updateStore(
        user.id,
        {
          store_name: storeName,
          address: address,
          latitude: parseFloat(latitude) || -6.2088,
          longitude: parseFloat(longitude) || 106.8456,
          phone: whatsapp.trim() || null
        },
        token
      )
      setMessage({ type: 'success', text: 'Profil warung berhasil diperbarui!' })
    } catch (err: any) {
      console.error('Error updating store:', err)
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil warung.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || (isFetching && !storeName)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Menyinkronkan data warung...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/seller/dashboard')}
            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight">Detail Warung & Lokasi</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelola alamat dan nomor WhatsApp bisnis</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <Card className="p-5 md:p-6 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm md:text-base">Informasi Profil Warung</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Identitas warung terdaftar</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl mb-6 text-xs font-bold border ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Store Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="storeName" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Nama Warung / Toko
              </label>
              <input
                id="storeName"
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Contoh: Warung Berkah"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Business WhatsApp Input */}
            <div className="space-y-1.5">
              <label htmlFor="whatsapp" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nomor WhatsApp Bisnis</span>
              </label>
              <input
                id="whatsapp"
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 6281234567890 (Gunakan kode negara 62)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400 font-medium">
                Nomor ini akan digunakan sebagai jalur komunikasi langsung untuk memverifikasi proses klaim atau pembelian pangan surplus Anda.
              </p>
            </div>

            {/* Address Input */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Alamat Pengambilan Pangan</span>
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap serta petunjuk patokan warung Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50 resize-none"
              />
            </div>

            {/* Geo Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="latitude" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Garis Lintang (Latitude)
                </label>
                <input
                  id="latitude"
                  type="text"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.2088"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="longitude" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Garis Bujur (Longitude)
                </label>
                <input
                  id="longitude"
                  type="text"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="106.8456"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold text-slate-800 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
