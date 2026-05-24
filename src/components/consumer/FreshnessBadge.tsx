import { getHoursSince, getFreshnessStatus } from '@/lib/utils'

interface FreshnessBadgeProps {
  cookedAt: string | Date
  className?: string
}

export default function FreshnessBadge({ cookedAt, className = '' }: FreshnessBadgeProps) {
  const hoursSince = getHoursSince(cookedAt)
  const status = getFreshnessStatus(hoursSince)

  const badgeConfig = {
    fresh: {
      label: 'NEW',
      className: 'badge-fresh',
      description: 'Baru dimasak',
    },
    warning: {
      label: `${hoursSince}H AGO`,
      className: 'badge-warning',
      description: 'Masih segar',
    },
    critical: {
      label: 'LAST CALL',
      className: 'badge-critical',
      description: 'Segera habis',
    },
  }

  const config = badgeConfig[status]

  return (
    <span
      className={`${config.className} ${className}`}
      title={`${config.description} - ${hoursSince} jam yang lalu`}
      aria-label={`${config.description}, dimasak ${hoursSince} jam yang lalu`}
    >
      {config.label}
    </span>
  )
}
