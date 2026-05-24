import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface RoleCardProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: LucideIcon
  title: string
  description: string
  isActive?: boolean
  onSelect?: () => void
}

const RoleCard = forwardRef<HTMLButtonElement, RoleCardProps>(
  ({ icon: Icon, title, description, isActive = false, onSelect, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        className={cn(
          'relative w-full p-6 rounded-xl border-2 transition-all duration-200',
          'flex flex-col items-center text-center gap-4',
          'focus-visible-ring hover:scale-105',
          'min-h-[180px] justify-center',
          {
            'border-accent-primary bg-accent-primary/10 shadow-lg': isActive,
            'border-outline/30 bg-surface-container hover:border-accent-primary/50': !isActive,
          },
          className
        )}
        aria-pressed={isActive}
        {...props}
      >
        {/* Icon Container */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200',
            {
              'bg-accent-primary text-bg-primary': isActive,
              'bg-surface-container-high text-outline': !isActive,
            }
          )}
        >
          <Icon size={32} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3
            className={cn('text-lg font-bold transition-colors', {
              'text-accent-primary': isActive,
              'text-on-surface-variant': !isActive,
            })}
          >
            {title}
          </h3>
          <p className="text-sm text-outline">{description}</p>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center">
              <svg
                className="w-4 h-4 text-bg-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </button>
    )
  }
)

RoleCard.displayName = 'RoleCard'

export default RoleCard
