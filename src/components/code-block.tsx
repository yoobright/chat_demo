'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  className?: string
  code: string
  children: React.ReactNode
  /**
   * Visual theme for the code block. Defaults to `light`.
   */
  theme?: 'light' | 'dark'
}

export function CodeBlock({ className, code, children, theme = 'light' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="relative">
      <pre
        className={cn(
          'overflow-x-auto rounded-lg p-4 text-sm w-full',
          theme === 'dark'
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <code className={cn(className)}>{children}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          'absolute right-2 top-2 rounded p-1',
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        )}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
