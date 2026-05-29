'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getTransactions, Transaction } from '@/services/api'
import { ClipboardList, MapPin, QrCode, CheckCircle2, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default function OrdersView() {
  const { token, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getTransactions(token)
        
        // Sort chronologically by claimed_at descending (newest first)
        const sorted = [...data].sort((a, b) => {
          return new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime()
        })
        
        setOrders(sorted)
      } catch (err) {
        console.error('Error fetching consumer orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, token])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Shimmer Header */}
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-200 rounded-lg" />
        </div>

        {/* Shimmer list */}
        <div className="space-y-4">
          <div className="h-32 w-full bg-slate-200 rounded-2xl" />
          <div className="h-32 w-full bg-slate-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Pesanan & Klaim Anda</h2>
        <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Daftar transaksi makanan terselamatkan</p>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isClaim = order.transaction_type === 'claim' || order.current_price === 0
            const isCompleted = order.status === 'completed' || order.status === 'sold_out'
            const date = new Date(order.claimed_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <Card
                key={order.id}
                className="p-4 md:p-5 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-50 mb-3">
                  <div>
                    <span className="text-xs font-black text-slate-800 tracking-tight">
                      {order.store_name || 'Mitra SisaRasa'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{date}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <Badge
                    variant={isCompleted ? 'success' : 'warning'}
                    className="rounded-full text-[9px] font-bold px-2 py-0.5 tracking-wider"
                  >
                    {isCompleted ? 'Selesai' : 'Pending Pengambilan'}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  {/* Placeholder icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-sm md:text-base truncate tracking-tight">
                      {order.product_name || 'Menu Pangan Lezat'}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {isClaim ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                          KLAIM DONASI (GRATIS)
                        </Badge>
                      ) : (
                        <span className="text-xs font-black text-emerald-600">
                          {formatCurrency(order.current_price || 0)}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">• {order.quantity || 1} Porsi</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-extrabold">Berhasil Terselamatkan</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span>Batas Ambil: Hari Ini</span>
                      </>
                    )}
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Kode verifikasi pengambilan: ${order.claim_code || order.order_code || 'SR-' + order.id.toUpperCase()}`)}
                        className="border-slate-200 text-slate-600 rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Barcode</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => alert('Membuka Google Maps menuju lokasi ' + (order.store_name || 'Mitra'))}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-3 py-1.5 transition-all text-xs flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Navigasi</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/40">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
            <ClipboardList className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Pesanan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Ayo selamatkan surplus makanan pertamamu hari ini untuk menjaga lingkungan dan menghemat pengeluaran!
          </p>
        </div>
      )}
    </div>
  )
}
