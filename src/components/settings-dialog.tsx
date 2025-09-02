'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { AppSettings, saveSettings } from '@/config'
import { useTranslation } from 'react-i18next'
import '@/i18n'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  settingsRef: React.MutableRefObject<AppSettings>
}

export function SettingsDialog({ open, onOpenChange, settingsRef }: Props) {
  const [apiBase, setApiBase] = React.useState(settingsRef.current.apiBase)
  const [apiKey, setApiKey] = React.useState(settingsRef.current.apiKey)
  const [model, setModel] = React.useState(settingsRef.current.model)
  const [systemPrompt, setSystemPrompt] = React.useState(
    settingsRef.current.systemPrompt
  )
  const { t } = useTranslation()

  React.useEffect(() => {
    if (open) {
      setApiBase(settingsRef.current.apiBase)
      setApiKey(settingsRef.current.apiKey)
      setModel(settingsRef.current.model)
      setSystemPrompt(settingsRef.current.systemPrompt)
    }
  }, [open, settingsRef])

  const save = () => {
    const newSettings: AppSettings = { apiBase, apiKey, model, systemPrompt }
    settingsRef.current = newSettings
    saveSettings(newSettings)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">{t('settings.apiBase')}</label>
            <Input value={apiBase} onChange={e => setApiBase(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t('settings.model')}</label>
            <Input value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t('settings.apiKey')}</label>
            <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t('settings.systemPrompt')}</label>
            <Textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} aria-label={t('settings.cancel')}>
            <X className="h-4 w-4" />
          </Button>
          <Button onClick={save} aria-label={t('settings.save')}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
