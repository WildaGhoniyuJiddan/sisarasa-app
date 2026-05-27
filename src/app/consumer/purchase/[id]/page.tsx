'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { mockMarketplaceProducts } from '@/lib/mock-data'
import { Product } from '@/types'
import { getHoursSince, getFreshnessStatus, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Sparkles, MapPin, Clock, QrCode, CreditCard, Coins, CheckCircle2, ShoppingBag, ShieldCheck, Ticket, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PurchaseProductPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [orderCode, setOrderCode] = useState<string>('')

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

  const handleIncrement = () => {
    if (product && quantity < product.availablePortions) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleConfirmPurchase = () => {
    // Generate order code
    const rand = Math.floor(1000 + Math.random() * 9000)
    setOrderCode(`SR-ORDER-${rand}`)
    setIsSuccess(true)
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-outline">Memuat detail pembelian...</p>
        </div>
      </div>
    )
  }

  const hoursSince = getHoursSince(product.cookedAt)
  const freshnessStatus = getFreshnessStatus(hoursSince)

  const normalTotal = product.normalPrice * quantity
  const currentTotal = product.currentPrice * quantity
  const savings = normalTotal - currentTotal

  const paymentOptions = [
    { id: 'wallet', name: 'SisaRasaPay Wallet', icon: Coins, desc: 'Saldo Rp 150.000 (Dapatkan 2% cashback)' },
    { id: 'qris', name: 'QRIS Gopay/OVO/Dana', icon: QrCode, desc: 'Instan pay menggunakan QR standar nasional' },
    { id: 'cash', name: 'Bayar di Tempat (COD)', icon: CreditCard, desc: 'Tunai saat mengambil porsi sisa di warung' },
  ]

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center px-4">
          <h1 className="text-md font-extrabold text-slate-800 mx-auto">Pembayaran Sukses!</h1>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
          {/* Success Callout */}
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Penyelamatan Pangan Berhasil</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Stok terpesan dan saldo dipotong aman</p>
          </div>

          {/* E-Ticket Card */}
          <Card className="p-6 border border-slate-100 bg-white shadow-md rounded-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-black uppercase tracking-wider">
              <Ticket className="w-3.5 h-3.5" />
              <span>VOUCHER AMBIL MAKANAN</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 inline-block">
              <QrCode className="w-40 h-40 text-slate-800 mx-auto" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kode Pengambilan</p>
              <p className="text-lg font-black text-emerald-600 tracking-tight mt-0.5">{orderCode}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 text-left space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Rincian Pembelian</span>
                <span className="text-slate-800 font-black">{quantity} Porsi</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-800">{product.name}</span>
                <span className="font-black text-emerald-600">{formatCurrency(currentTotal)}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lokasi Warung</p>
                  <p className="text-sm font-extrabold text-slate-800">{product.sellerName}</p>
                  <p className="text-xs text-slate-400 font-medium">Radius {product.distance ? `${product.distance / 1000} km` : '1.2 km'} dari Anda</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Eco Banner */}
          <Card className="p-4 bg-emerald-50/20 border border-emerald-50/50 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Keuntungan Anda</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                Melalui transaksi ini, Anda berhasil menghemat <strong>{formatCurrency(savings)}</strong> dan mencegah sampah emisi CO₂ masakan!
              </p>
            </div>
          </Card>
        </main>

        <div className="px-4 max-w-md mx-auto w-full">
          <Button
            onClick={() => router.push('/consumer/marketplace')}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-5 rounded-2xl shadow-sm transition-all"
          >
            Selesai & Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans pb-8">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 safe-top shadow-sm h-16 flex items-center justify-between px-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-md font-extrabold text-slate-800">Konfirmasi Pembelian</h1>
        <div className="w-10" />
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Product Card Info */}
        <Card className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-black tracking-wider uppercase">
                SURPLUS SURGAWAN
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
                  {product.availablePortions} porsi sisa tersedia
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quantity Increment Selector */}
        <Card className="p-4 border border-slate-100 bg-white shadow-sm rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">Jumlah Porsi</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Satu porsi cukup menyelamatkan hari</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-50 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-extrabold text-slate-800">{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.availablePortions}
              className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-50 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Payment Choices */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Metode Pembayaran</h4>
          {paymentOptions.map((opt) => {
            const Icon = opt.icon
            const isSelected = paymentMethod === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/5 shadow-sm' 
                    : 'border-slate-100 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                    isSelected ? 'bg-emerald-100/50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-extrabold text-slate-800 block">{opt.name}</span>
                    <span className="text-xs text-slate-400 font-medium truncate block">{opt.desc}</span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pricing Summary */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl space-y-3">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">Ringkasan Pembayaran</h4>
          
          <div className="flex justify-between items-center text-sm font-medium text-slate-500">
            <span>Harga Normal ({quantity} porsi)</span>
            <span className="line-through">{formatCurrency(normalTotal)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm font-medium text-emerald-600">
            <span>Diskon Selamat Pangan</span>
            <span>-{formatCurrency(savings)}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-medium text-slate-500">
            <span>Biaya Pengambilan Mandiri</span>
            <span>Gratis</span>
          </div>

          <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
            <span className="text-sm font-extrabold text-slate-800">Total Pembayaran</span>
            <span className="text-lg font-black text-emerald-600 tracking-tight">{formatCurrency(currentTotal)}</span>
          </div>

          {/* Dopamine-saving banner */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center">
            <span className="text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>YAY! Anda Berhasil Berhemat {formatCurrency(savings)}!</span>
            </span>
          </div>
        </Card>
      </main>

      {/* Action Purchase Button */}
      <div className="px-4 max-w-md mx-auto w-full">
        <Button
          onClick={handleConfirmPurchase}
          className="w-full bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black py-6 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Konfirmasi & Bayar Sekarang</span>
        </Button>
      </div>
    </div>
  )
}
