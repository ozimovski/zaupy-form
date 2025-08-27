import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    }

    const variantClasses = {
      primary: 'text-primary-600',
      secondary: 'text-gray-600',
      white: 'text-white',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Additional loading component with text
export interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function Loading({ text = 'Loading...', size = 'md', variant = 'primary', className }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <LoadingSpinner size={size} variant={variant} />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  )
}

export { LoadingSpinner }
