'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')

  if (!mounted) {
    return (
      <Button aria-label="Toggle theme">
        <Sun />
      </Button>
    )
  }

  return (
    <Button onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
