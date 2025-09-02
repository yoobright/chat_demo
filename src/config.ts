export interface AppSettings {
  apiBase: string
  apiKey: string
  model: string
  systemPrompt: string
}

export let API_PREFIX = ''

export function setApiBase(base: string) {
  API_PREFIX = base
}

export const defaultSettings: AppSettings = {
  apiBase: '',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  systemPrompt: '',
}

export function loadSettings(): AppSettings {
  let settings = defaultSettings
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('settings')
    if (stored) {
      try {
        settings = { ...defaultSettings, ...JSON.parse(stored) }
      } catch {
        settings = defaultSettings
      }
    }
  }
  setApiBase(settings.apiBase)
  return settings
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
  setApiBase(settings.apiBase)
}
