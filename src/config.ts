export interface AppSettings {
  apiBase: string
  apiKey: string
  model: string
  systemPrompt: string
}

export const defaultSettings: AppSettings = {
  apiBase: '',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  systemPrompt: '',
}

export function loadSettings(): AppSettings {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('settings')
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }
      } catch {
        return defaultSettings
      }
    }
  }
  return defaultSettings
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
}
