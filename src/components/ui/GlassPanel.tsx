import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'section' | 'article'
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, padding = 'md', as: Component = 'div', ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <Component
        ref={ref}
        className={cn('glass-panel', paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export default GlassPanel
