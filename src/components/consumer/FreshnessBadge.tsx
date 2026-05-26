import { getHoursSince, getFreshnessStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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
      variant: 'success' as const,
      description: 'Baru dimasak',
    },
    warning: {
      label: `${hoursSince}H AGO`,
      variant: 'warning' as const,
      description: 'Masih segar',
    },
    critical: {
      label: 'LAST CALL',
      variant: 'destructive' as const,
      description: 'Segera habis',
    },
  }

  const config = badgeConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={`rounded-full font-extrabold text-[10px] tracking-wider px-2 py-0.5 shadow-sm ${className}`}
      title={`${config.description} - ${hoursSince} jam yang lalu`}
      aria-label={`${config.description}, dimasak ${hoursSince} jam yang lalu`}
    >
      {config.label}
    </Badge>
  )
}
