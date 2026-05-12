'use client';

import { Product } from '@/types';
import {
  formatPrice,
  getDiscountPercent,
  getFreshnessStatus,
  freshnessShortLabel,
  freshnessColor,
  freshnessBgColor,
  freshnessBorderColor,
  getHoursElapsed,
} from '@/lib/utils';
import FreshnessRing from './FreshnessRing';

interface ProductCardProps {
  product: Product;
  onActivateDonation?: (id: string) => void;
  onActivateDiscount?: (id: string) => void;
  variant?: 'dashboard' | 'marketplace';
}

export default function ProductCard({
  product,
  onActivateDonation,
  onActivateDiscount,
  variant = 'dashboard',
}: ProductCardProps) {
  const freshness = getFreshnessStatus(product.cookedAt);
  const fColor    = freshnessColor(freshness);
  const fBg       = freshnessBgColor(freshness);
  const fBorder   = freshnessBorderColor(freshness);
  const discount  = getDiscountPercent(product);
  const hours     = getHoursElapsed(product.cookedAt);

  const stripClass = product.status === 'donation'
    ? 'status-strip-donation'
    : freshness === 'fresh' ? 'status-strip-fresh'
    : freshness === 'warn'  ? 'status-strip-warn'
    : 'status-strip-critical';

  return (
    <div className="card" style={{ padding: '14px 14px 14px 18px', position: 'relative', overflow: 'hidden' }}>
      <div className={`status-strip ${stripClass}`} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <FreshnessRing cookedAt={product.cookedAt} size={56} showLabel={false} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{product.imageEmoji}</span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: fBg, color: fColor, border: `1px solid ${fBorder}`, fontSize: 9 }}>
                  {freshnessShortLabel(freshness)} · {hours.toFixed(1)}j
                </span>
                {product.status === 'donation' && (
                  <span className="badge badge-recipient" style={{ fontSize: 9 }}>Open Donasi</span>
                )}
                {product.status === 'discounted' && discount > 0 && (
                  <span className="badge badge-orange" style={{ fontSize: 9 }}>-{discount}%</span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="data-text" style={{
                color: product.status === 'donation' ? 'var(--donation-green)' : 'var(--text-primary)',
                fontSize: 14, fontWeight: 800,
              }}>
                {formatPrice(product.currentPrice)}
              </div>
              {discount > 0 && product.status !== 'donation' && (
                <div className="data-text" style={{ color: 'var(--text-muted)', fontSize: 11, textDecoration: 'line-through' }}>
                  {formatPrice(product.normalPrice)}
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              📦 {product.qty} sisa
              {variant === 'marketplace' && <span> · {product.stallName}</span>}
            </div>

            {variant === 'dashboard' && product.status !== 'donation' && product.status !== 'sold' && (
              <div style={{ display: 'flex', gap: 6 }}>
                {(freshness === 'warn' || freshness === 'critical') && product.status === 'available' && (
                  <button className="btn-cyan" style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={() => onActivateDiscount?.(product.id)}>
                    💸 Diskon
                  </button>
                )}
                {freshness === 'critical' && (
                  <button className="btn-donation" style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={() => onActivateDonation?.(product.id)}>
                    🤝 Donasi
                  </button>
                )}
              </div>
            )}

            {variant === 'marketplace' && product.status === 'donation' && (
              <button className="btn-donation" style={{ padding: '5px 12px', fontSize: 11 }}>
                Claim
              </button>
            )}
            {variant === 'marketplace' && product.status !== 'donation' && (
              <button className="btn-primary" style={{ padding: '5px 12px', fontSize: 11 }}>
                Beli
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
