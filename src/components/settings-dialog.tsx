'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { AppSettings, saveSettings } from '@/config'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  settingsRef: React.MutableRefObject<AppSettings>
  lang: 'en' | 'zh'
}

export function SettingsDialog({ open, onOpenChange, settingsRef, lang }: Props) {
  const [apiBase, setApiBase] = React.useState(settingsRef.current.apiBase)
  const [apiKey, setApiKey] = React.useState(settingsRef.current.apiKey)
  const [model, setModel] = React.useState(settingsRef.current.model)
  const [systemPrompt, setSystemPrompt] = React.useState(
    settingsRef.current.systemPrompt
  )

  React.useEffect(() => {
    if (open) {
      setApiBase(settingsRef.current.apiBase)
      setApiKey(settingsRef.current.apiKey)
      setModel(settingsRef.current.model)
      setSystemPrompt(settingsRef.current.systemPrompt)
    }
  }, [open, settingsRef])

  const t = {
    en: {
      title: 'Settings',
      apiBase: 'API Base URL',
      model: 'Model',
      apiKey: 'API Key',
      systemPrompt: 'System Prompt',
      cancel: 'Cancel',
      save: 'Save',
    },
    zh: {
      title: '设置',
      apiBase: 'API 地址',
      model: '模型',
      apiKey: 'API 密钥',
      systemPrompt: '系统提示词',
      cancel: '取消',
      save: '保存',
    },
  }[lang]

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
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">{t.apiBase}</label>
            <Input value={apiBase} onChange={e => setApiBase(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t.model}</label>
            <Input value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t.apiKey}</label>
            <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">{t.systemPrompt}</label>
            <Textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} aria-label={t.cancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button onClick={save} aria-label={t.save}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
