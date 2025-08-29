import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const variants: Record<string, string> = {
  default: 'bg-blue-500 text-white hover:bg-blue-600',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4',
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = 'Button'
