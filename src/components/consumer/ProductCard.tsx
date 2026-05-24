import { MapPin } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency, formatDistance } from '@/lib/utils'
import FreshnessBadge from './FreshnessBadge'
import TactileButton from '@/components/ui/TactileButton'

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

  return (
    <article className="card-horizontal relative">
      {/* Product Image */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-high">
        {/* Freshness Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <FreshnessBadge cookedAt={product.cookedAt} />
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl">🍽️</span>
        </div>

        {/* Discount Badge - Bottom Left */}
        {discountPercentage > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-critical-red text-white text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-bold text-on-surface-variant text-base mb-1 truncate">
            {product.name}
          </h3>

          {/* Seller Name & Distance */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-outline truncate">{product.sellerName}</p>
            {product.distance !== undefined && (
              <>
                <span className="text-outline">•</span>
                <div className="flex items-center gap-1 text-sm text-outline">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(product.distance)}</span>
                </div>
              </>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-2">
            {!isDonation && (
              <>
                <span className="text-sm line-through text-outline">
                  {formatCurrency(product.normalPrice)}
                </span>
                <span className="text-lg font-black text-accent-primary">
                  {formatCurrency(product.currentPrice)}
                </span>
              </>
            )}
            {isDonation && (
              <span className="text-lg font-black text-fresh-mint">GRATIS</span>
            )}
          </div>

          {/* Portions Available */}
          <p className="text-xs text-outline">
            {product.availablePortions} porsi tersedia
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex justify-end">
          <TactileButton
            onClick={handleAction}
            variant={isDonation ? 'primary' : 'primary'}
            className={`text-sm px-6 py-2 ${
              isDonation ? 'bg-fresh-mint hover:bg-fresh-mint' : ''
            }`}
          >
            {isDonation ? 'Claim Donasi' : 'Beli'}
          </TactileButton>
        </div>
      </div>
    </article>
  )
}
