'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  className?: string
  code: string
  children: React.ReactNode
}

export function CodeBlock({ className, code, children }: CodeBlockProps) {
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
      <pre className="overflow-x-auto rounded-lg p-4 text-sm">
        <code className={cn(className)}>{children}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 rounded bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
