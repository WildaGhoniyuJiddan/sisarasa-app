import Image from 'next/image'
import { MapPin, Sparkles, AlertCircle } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency, formatDistance } from '@/lib/utils'
import FreshnessBadge from './FreshnessBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
  onAction?: (product: Product) => void
}

export default function ProductCard({ product, onAction }: ProductCardProps) {
  const isDonation = product.donationStatus === 'donation'
  const discountPercentage = Math.round(
    ((product.normalPrice - product.currentPrice) / product.normalPrice) * 100
  )

  const handleAction = () => {
    if (onAction) {
      onAction(product)
    }
  }

  // Fallback image using placeholder structure
  const imageUrl = product.photoUrl || '/images/sayur.jpg'

  return (
    <Card className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 rounded-2xl relative overflow-hidden">
      
      {/* Product Image Sisi Kiri */}
      <div className="relative w-full sm:w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
        {/* Freshness Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <FreshnessBadge cookedAt={product.cookedAt} />
        </div>

        {/* Product Image with Next.js <Image /> */}
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 112px"
            className="object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              // Fallback handled gracefully
            }}
          />
        </div>

        {/* Discount Badge - Bottom Left */}
        {!isDonation && discountPercentage > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute bottom-2 left-2 rounded-full font-black text-[10px] tracking-wider px-2 py-0.5 shadow-sm"
          >
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Product Details Sisi Tengah & Kanan */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
        
        {/* Sisi Tengah (Detail Produk) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Product Name */}
            <h3 className="font-extrabold text-slate-800 text-base mb-1 truncate tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">
              {product.name}
            </h3>

            {/* Seller Name & Distance */}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-bold text-slate-500 truncate">{product.sellerName}</p>
              {product.distance !== undefined && (
                <>
                  <span className="text-slate-300 text-xs">•</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{formatDistance(product.distance)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="flex flex-wrap items-end justify-between sm:justify-start gap-4">
            <div className="flex items-baseline gap-2">
              {!isDonation && (
                <>
                  <span className="text-xs line-through text-slate-400 font-medium">
                    {formatCurrency(product.normalPrice)}
                  </span>
                  <span className="text-lg font-black text-emerald-600 tracking-tight">
                    {formatCurrency(product.currentPrice)}
                  </span>
                </>
              )}
              {isDonation && (
                <Badge variant="success" className="rounded-full text-xs font-black tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100">
                  GRATIS DONASI
                </Badge>
              )}
            </div>

            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.availablePortions} porsi sisa
            </span>
          </div>
        </div>

        {/* Sisi Kanan (Aksi Button) */}
        <div className="flex sm:flex-col justify-end items-end shrink-0">
          <Button
            onClick={handleAction}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-6 py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all text-xs tracking-wider uppercase"
          >
            {isDonation ? 'Claim Donasi' : 'Beli Sekarang'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
