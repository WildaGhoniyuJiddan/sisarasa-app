'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, TrendingDown, Clock, Info, ShieldAlert, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProducts, Product as ApiProduct } from '@/services/api'
import { Product, DonationStatus, ProductStatus } from '@/types'
import { formatCurrency, getHoursSince } from '@/lib/utils'

export default function DynamicPricingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'seller')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  // Fetch real-time products
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsFetching(false)
      return
    }

    const fetchPrices = async () => {
      try {
        setIsFetching(true)
        setError(null)
        const apiProducts = await getProducts()
        
        // Map to frontend products
        const mapped: Product[] = apiProducts.map((p: ApiProduct) => ({
          id: p.id,
          sellerId: p.sellerId,
          sellerName: user.username || 'Mitra Warung',
          name: p.name,
          description: 'Pangan surplus terkelola.',
          photoUrl: p.photoUrl || '/images/sayur.jpg',
          normalPrice: p.normalPrice,
          currentPrice: p.currentPrice,
          cookedAt: p.cookedAt,
          totalPortions: p.portions || 1,
          availablePortions: p.availablePortions !== undefined ? p.availablePortions : (p.portions || 1),
          donationStatus: 'sale' as DonationStatus,
          status: (p.status as ProductStatus) || 'active',
        }))

        // Filter strictly to this store
        const sellerProducts = mapped.filter((p) => p.sellerId === user.id)
        setProducts(sellerProducts)
      } catch (err: any) {
        console.error('Error fetching dynamic pricing list:', err)
        setError('Gagal menyinkronkan data harga dinamis.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchPrices()
  }, [isAuthenticated, user])

  if (isLoading || (isFetching && products.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Menyinkronkan data harga dinamis...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'seller') {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 font-sans pb-12">
      {/* Header Container */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/seller/dashboard')}
            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">Monitor Harga Dinamis</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phase 5 automated price decay monitor</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Banner Section */}
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm animate-pulse-slow">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-900 tracking-tight">
              Monitor Harga Dinamis SisaRasa
            </h2>
            <p className="text-xs md:text-sm text-emerald-700/80 leading-relaxed font-medium mt-1">
              Pantau penurunan harga otomatis produk surplus Anda secara real-time berdasarkan sisa waktu kelayakan.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Pricing Table Card */}
        <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Daftar Penurunan Harga</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Pembaruan otomatis berkala</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
              {products.length} Makanan Terdaftar
            </Badge>
          </div>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Nama Produk</th>
                    <th className="py-4 px-6 text-center">Harga Awal</th>
                    <th className="py-4 px-6 text-center">Harga Terkini (Decayed)</th>
                    <th className="py-4 px-6 text-center">Batas HPP (Floor)</th>
                    <th className="py-4 px-6 text-center">Status Diskon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product) => {
                    const hoursSince = getHoursSince(product.cookedAt)
                    
                    // Standard Phase 5 decay floor is 50% of the normalPrice
                    const hppFloor = Math.round(product.normalPrice * 0.5)
                    const isAtFloor = product.currentPrice <= hppFloor

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Name & Freshness Info */}
                        <td className="py-5 px-6">
                          <span className="font-extrabold text-slate-800 block text-sm tracking-tight">
                            {product.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span>Dimasak {hoursSince} jam lalu</span>
                          </span>
                        </td>

                        {/* Original Price */}
                        <td className="py-5 px-6 text-center font-semibold text-slate-400 text-sm">
                          {formatCurrency(product.normalPrice)}
                        </td>

                        {/* Decayed Price */}
                        <td className="py-5 px-6 text-center">
                          <span className="font-black text-emerald-600 text-base tracking-tight">
                            {formatCurrency(product.currentPrice)}
                          </span>
                        </td>

                        {/* HPP Floor */}
                        <td className="py-5 px-6 text-center font-semibold text-slate-500 text-sm">
                          {formatCurrency(hppFloor)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-5 px-6 text-center">
                          {isAtFloor ? (
                            <Badge className="bg-slate-100 text-slate-500 border border-slate-200/50 rounded-full font-bold text-[9px] px-2.5 py-1 tracking-wider uppercase">
                              Batas Maksimal Diskon
                            </Badge>
                          ) : (
                            <Badge className="bg-sky-50 text-sky-700 border border-sky-100 rounded-full font-bold text-[9px] px-2.5 py-1 tracking-wider uppercase animate-pulse-slow">
                              🎯 Sedang Menurun
                            </Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center bg-white">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <TrendingDown className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800">Tidak ada produk surplus terdaftar</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Unggah surplus makanan Anda dari dashboard untuk mengaktifkan pemantauan diskon harga dinamis.
              </p>
            </div>
          )}
        </Card>

        {/* Informative Guidance */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <Info className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">Informasi Formula Harga Dinamis</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Sistem AI SisaRasa secara otomatis menurunkan harga jual produk surplus sebesar 5% - 10% setiap jamnya 
                berdasarkan sisa waktu kelayakan konsumsi makanan (expiring). Harga tidak akan pernah turun melebihi batas 
                HPP Floor (50% dari harga normal) guna melindungi margin dasar operasional usaha warung Anda.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
