'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')
  return (
    <Button onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
