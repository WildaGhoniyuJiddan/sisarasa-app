'use client';

import { Product } from '@/types';
import {
  getFreshnessStatus,
  freshnessShortLabel,
  freshnessDotClass,
  formatPrice,
  getDiscountPercent,
  formatHours,
} from '@/lib/utils';

interface FoodCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  onClaim?: (product: Product) => void;
}

export default function FoodCard({ product, onBuy, onClaim }: FoodCardProps) {
  const freshness = getFreshnessStatus(product.cookedAt);
  const discount = getDiscountPercent(product);
  const hoursLabel = formatHours(product.cookedAt);
  const isDonation = product.isDonation || product.status === 'donation';

  return (
    <div
      className="food-card"
      style={{ position: 'relative' }}
    >
      {/* Status strip (left edge) */}
      <div
        className={`status-strip status-strip-${isDonation ? 'donation' : freshness}`}
      />

      {/* Image area */}
      <div className="food-card-image">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="food-card-image-real"
          />
        ) : (
          <span style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
            {product.imageEmoji}
          </span>
        )}

        {/* Discount badge (top right) */}
        {discount > 0 && !isDonation && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'var(--urgent)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.04em',
            }}
          >
            -{discount}%
          </div>
        )}

        {/* Donation badge */}
        {isDonation && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'var(--donation-green)',
              color: '#0A1F1A',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.06em',
            }}
          >
            DONASI
          </div>
        )}

        {/* Freshness dot overlay (bottom-left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(0,0,0,0.55)',
            padding: '3px 8px',
            borderRadius: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span className={freshnessDotClass(freshness)} />
          <span
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.04em',
            }}
          >
            {hoursLabel} · {freshnessShortLabel(freshness)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        {/* Stall name */}
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          {product.stallName}
        </div>

        {/* Product name */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {product.name}
        </div>

        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div>
            {isDonation ? (
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--donation-green)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                GRATIS
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {discount > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textDecoration: 'line-through',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {formatPrice(product.normalPrice)}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: discount > 0 ? 'var(--orange)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {formatPrice(product.currentPrice)}
                </span>
              </div>
            )}
          </div>

          {/* CTA button */}
          {isDonation ? (
            <button
              className="btn-donation"
              style={{ fontSize: 12, padding: '8px 14px' }}
              onClick={() => onClaim?.(product)}
            >
              Ambil Donasi
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ fontSize: 12, padding: '8px 14px' }}
              onClick={() => onBuy?.(product)}
              disabled={product.status === 'sold'}
            >
              {product.status === 'sold' ? 'Habis' : 'Beli'}
            </button>
          )}
        </div>

        {/* Qty badge */}
        <div style={{ marginTop: 8 }}>
          <span className="badge badge-gray">
            Sisa {product.qty} porsi
          </span>
        </div>
      </div>
    </div>
  );
}
