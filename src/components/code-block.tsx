'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

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
    <div>
      <pre>
        <code className={className}>{children}</code>
      </pre>
      <button type="button" onClick={onCopy} aria-label="Copy code">
        {copied ? <Check /> : <Copy />}
      </button>
    </div>
  )
}
