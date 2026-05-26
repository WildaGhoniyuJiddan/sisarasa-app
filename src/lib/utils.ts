import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate time difference in hours
 */
export function getHoursSince(timestamp: Date | string): number {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60))
}

/**
 * Get freshness status based on hours since cooked
 */
export function getFreshnessStatus(hoursSince: number): 'fresh' | 'warning' | 'critical' {
  if (hoursSince < 4) return 'fresh'
  if (hoursSince < 8) return 'warning'
  return 'critical'
}

/**
 * Format distance in meters to readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Calculate dynamic price based on exponential decay
 * Minimum price is 50% of original (break-even protection)
 */
export function calculateDynamicPrice(
  originalPrice: number,
  hoursSinceCooked: number,
  maxHours: number = 12
): number {
  const decayRate = 0.5 // 50% maximum discount
  const progress = Math.min(hoursSinceCooked / maxHours, 1)
  const discount = decayRate * progress
  const finalPrice = originalPrice * (1 - discount)

  // Ensure minimum 50% of original price
  return Math.max(finalPrice, originalPrice * 0.5)
}

/**
 * Format timestamp to Indonesian time format
 */
export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}

/**
 * Format date to Indonesian date format
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}
