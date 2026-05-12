import { Product, FreshnessStatus } from '@/types';

/**
 * Returns freshness status per PRD specs:
 * fresh: 0–4h (Hijau), warn: 4–8h (Kuning), critical: >8h (Merah/Donasi)
 */
export function getFreshnessStatus(cookedAt: Date): FreshnessStatus {
  const hours = (Date.now() - cookedAt.getTime()) / (1000 * 60 * 60);
  if (hours < 4) return 'fresh';
  if (hours < 8) return 'warn';
  return 'critical';
}

export function getHoursElapsed(cookedAt: Date): number {
  return (Date.now() - cookedAt.getTime()) / (1000 * 60 * 60);
}

/** Returns 0–1 progress for freshness bar (0=fresh, 1=critical) */
export function getFreshnessProgress(cookedAt: Date): number {
  const hours = getHoursElapsed(cookedAt);
  return Math.min(hours / 8, 1);
}

export function freshnessColor(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return '#2EE89A'; // --fresh
    case 'warn':     return '#F8F49F'; // --warn
    case 'critical': return '#FF3D1F'; // --critical
  }
}

export function freshnessBgColor(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'rgba(46,232,154,0.12)';
    case 'warn':     return 'rgba(248,244,159,0.10)';
    case 'critical': return 'rgba(255,61,31,0.12)';
  }
}

export function freshnessBorderColor(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'rgba(46,232,154,0.30)';
    case 'warn':     return 'rgba(248,244,159,0.30)';
    case 'critical': return 'rgba(255,61,31,0.30)';
  }
}

export function freshnessLabel(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'Fresh (0-4 jam)';
    case 'warn':     return 'Segera Habiskan (4-8 jam)';
    case 'critical': return 'Surplus/Donasi (>8 jam)';
  }
}

export function freshnessShortLabel(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'Fresh';
    case 'warn':     return 'Segera';
    case 'critical': return 'Surplus';
  }
}

export function freshnessDotClass(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'freshness-dot freshness-dot-fresh';
    case 'warn':     return 'freshness-dot freshness-dot-warn';
    case 'critical': return 'freshness-dot freshness-dot-critical';
  }
}

export function freshnessBarClass(status: FreshnessStatus): string {
  switch (status) {
    case 'fresh':    return 'freshness-bar freshness-bar-fresh';
    case 'warn':     return 'freshness-bar freshness-bar-warn';
    case 'critical': return 'freshness-bar freshness-bar-critical';
  }
}

export function formatPrice(price: number): string {
  if (price === 0) return 'GRATIS';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(product: Product): number {
  if (product.normalPrice === 0) return 0;
  return Math.round(
    ((product.normalPrice - product.currentPrice) / product.normalPrice) * 100
  );
}

export function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1)  return 'Baru saja';
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export function formatHours(cookedAt: Date): string {
  const h = getHoursElapsed(cookedAt);
  if (h < 1) return `${Math.round(h * 60)}m`;
  return `${h.toFixed(1)}j`;
}

export function formatCountdown(date: Date): string {
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return 'Kedaluwarsa';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins  = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((ms % (1000 * 60)) / 1000);
  return [hours, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
