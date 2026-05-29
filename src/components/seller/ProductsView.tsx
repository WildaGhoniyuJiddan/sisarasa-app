'use client'

import { useState, useEffect } from 'react'
import { Plus, Utensils, Edit3, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getHoursSince, getFreshnessStatus, formatCurrency } from '@/lib/utils'
import { Product } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { updateProduct } from '@/services/api'
import Image from 'next/image'

interface ProductsViewProps {
  products: Product[]
  router: any
}

export default function ProductsView({ products, router }: ProductsViewProps) {
  const { token } = useAuth()
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [currentPrice, setCurrentPrice] = useState<string>('')
  const [portions, setPortions] = useState<string>('')
  const [isDonation, setIsDonation] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsDonation(product.donationStatus === 'donation' || product.currentPrice === 0)
    setCurrentPrice(product.currentPrice.toString())
    setPortions(product.availablePortions.toString())
    setModalError(null)
    setSuccessToast(null)
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    const priceNum = isDonation ? 0 : parseInt(currentPrice)
    const portionsNum = parseInt(portions)

    if (isNaN(priceNum) || priceNum < 0) {
      setModalError('Masukkan harga sekarang yang valid.')
      return
    }
    if (isNaN(portionsNum) || portionsNum < 0) {
      setModalError('Masukkan jumlah porsi yang valid.')
      return
    }

    setIsSaving(true)
    setModalError(null)

    try {
      if (!token) {
        throw new Error('Sesi login telah kedaluwarsa.')
      }

      await updateProduct(
        editingProduct.id,
        {
          currentPrice: priceNum,
          availablePortions: portionsNum,
          status: 'active'
        } as any,
        token
      )

      // Hydrate local state instantly using local state inputs
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                currentPrice: priceNum,
                availablePortions: portionsNum,
                donationStatus: isDonation ? 'donation' : 'sale',
                status: portionsNum === 0 ? 'sold_out' : 'active',
              }
            : p
        )
      )

      setSuccessToast('Produk surplus berhasil diperbarui!')
      
      // Close modal after success toast shows briefly
      setTimeout(() => {
        setEditingProduct(null)
        setSuccessToast(null)
      }, 1000)
    } catch (err: any) {
      console.error(err)
      setModalError(err.message || 'Gagal menyimpan perubahan produk.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Kelola Pangan Surplus</h2>
          <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Daftar menu aktif & penyesuaian otomatis</p>
        </div>
        
        <Button
          onClick={() => router.push('/seller/scan')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-4 py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Upload Makanan</span>
        </Button>
      </div>

      {/* Products List */}
      {localProducts.length > 0 ? (
        <div className="space-y-4">
          {localProducts.map((product) => {
            const hoursSince = getHoursSince(product.cookedAt)
            const freshnessStatus = getFreshnessStatus(hoursSince)
            const isDonationItem = product.donationStatus === 'donation' || product.currentPrice === 0
            const isSoldOut = product.availablePortions === 0 || product.status === 'sold_out'

            return (
              <Card
                key={product.id}
                className={`p-4 md:p-5 border bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl ${
                  isSoldOut ? 'border-slate-200 opacity-70' : 'border-slate-100'
                }`}
              >
                {/* Product Info Row */}
                <div className="flex items-start gap-4">
                  {/* Left Side: Product Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 relative bg-emerald-50">
                    {product.photoUrl ? (
                      <Image
                        src={product.photoUrl}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600">
                        <Utensils className="w-7 h-7" />
                      </div>
                    )}
                  </div>

                  {/* Middle Side: Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-800 text-sm md:text-base truncate tracking-tight">
                        {product.name}
                      </h3>
                      {isSoldOut ? (
                        <Badge variant="destructive" className="rounded-full font-bold text-[8px] md:text-[9px] px-2 py-0.5 tracking-wider shrink-0">
                          HABIS TERJUAL
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[8px] md:text-[9px] px-2 py-0.5 tracking-wider shrink-0">
                          AKTIF DIPASARKAN
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <Badge
                        variant={
                          freshnessStatus === 'fresh'
                            ? 'success'
                            : freshnessStatus === 'warning'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="rounded-full text-[8px] md:text-[9px] px-2 font-bold tracking-wider"
                      >
                        {hoursSince} jam yang lalu
                      </Badge>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400">
                        {product.availablePortions}/{product.totalPortions} porsi sisa
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline gap-2">
                      {isDonationItem ? (
                        <Badge variant="success" className="rounded-full text-[10px] font-black tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100">
                          DONASI SOSIAL
                        </Badge>
                      ) : (
                        <>
                          <span className="text-[10px] md:text-xs line-through text-slate-400 font-medium font-mono">
                            {formatCurrency(product.normalPrice)}
                          </span>
                          <span className="text-base font-black text-emerald-600 tracking-tight font-mono">
                            {formatCurrency(product.currentPrice)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Row */}
                {!isSoldOut && (
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Fitur diskon AI untuk ${product.name} telah disinkronkan!`)}
                      className="border-emerald-100 text-emerald-600 hover:bg-emerald-50/50 rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimasi AI</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(product)}
                      className="border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/40">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
            <Utensils className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Stok Pangan Kosong</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Belum ada porsi sisa yang Anda pasarkan hari ini. Pasarkan kelebihan stok Anda sekarang!
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Edit Porsi & Harga</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{editingProduct.name}</p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg focus:outline-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveChanges} className="p-6 space-y-5">
              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold leading-relaxed">
                  {modalError}
                </div>
              )}

              {successToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold leading-relaxed">
                  {successToast}
                </div>
              )}

              {/* Tipe Distribusi Toggle Switch */}
              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Tipe Distribusi
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-slate-800 block">Ubah Jadi Gratis (Donasi Sosial)</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">Salurkan gratis untuk penerima manfaat</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isDonation}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setIsDonation(checked)
                      if (checked) {
                        setCurrentPrice('0')
                      } else {
                        setCurrentPrice(editingProduct.normalPrice.toString())
                      }
                    }}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* Harga Sekarang Input */}
              <div className="space-y-1.5">
                <label htmlFor="modal-current-price" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Harga Sekarang (Rp)
                </label>
                <input
                  id="modal-current-price"
                  type="number"
                  disabled={isDonation}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  placeholder="Contoh: 12000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              {/* Jumlah Porsi Input */}
              <div className="space-y-1.5">
                <label htmlFor="modal-portions" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Jumlah Porsi Tersisa
                </label>
                <input
                  id="modal-portions"
                  type="number"
                  min={0}
                  max={editingProduct.totalPortions}
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  placeholder="Contoh: 4"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl font-bold py-3 transition-all"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3 shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
