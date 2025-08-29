'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  settingsRef: React.MutableRefObject<{ apiBase: string; apiKey: string; model: string }>
}

export function SettingsDialog({ open, onOpenChange, settingsRef }: Props) {
  const [apiBase, setApiBase] = React.useState(settingsRef.current.apiBase)
  const [apiKey, setApiKey] = React.useState(settingsRef.current.apiKey)
  const [model, setModel] = React.useState(settingsRef.current.model)

  const save = () => {
    settingsRef.current.apiBase = apiBase
    settingsRef.current.apiKey = apiKey
    settingsRef.current.model = model
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">API Base URL</label>
            <Input value={apiBase} onChange={e => setApiBase(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Model</label>
            <Input value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">API Key</label>
            <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
