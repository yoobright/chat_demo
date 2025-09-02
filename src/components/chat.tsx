'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SettingsDialog } from '@/components/settings-dialog'
import { ThemeToggle } from '@/components/theme-toggle'
import { Markdown } from '@/components/markdown'
import Toast from '@/components/toast'
import { Loader2, Languages, Settings, Send, Trash2 } from 'lucide-react'
import { loadSettings, AppSettings } from '@/config'

type RoleType = 'system' | 'user' | 'assistant'
interface Message {
  role: RoleType
  content: string
}

function getNodeText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.type === 'text') return node.value
  if (Array.isArray(node.children)) return node.children.map(getNodeText).join('')
  return ''
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'zh'>('zh')
  const [loading, setLoading] = useState(false)
  const settingsRef = useRef<AppSettings>(loadSettings())

  const t = {
    en: {
      title: 'Chat Demo',
      settings: 'Settings',
      placeholder: 'Send a message',
      send: 'Send',
      toggleLang: '中文',
      clear: 'Clear',
      msgEmpty: 'Message is empty',
    },
    zh: {
      title: '聊天演示',
      settings: '设置',
      placeholder: '发送消息',
      send: '发送',
      toggleLang: 'EN',
      clear: '清空',
      msgEmpty: '消息不能为空',
    },
  }[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const stored = localStorage.getItem('messages')
    if (stored) {
      try {
        setMessages(JSON.parse(stored))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  const sendMessage = async () => {
    if (!input) {
      Toast.notify({ type: 'error', message: t.msgEmpty })
      return
    }
    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages([...newMessages as Message[], { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${settingsRef.current.apiBase}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settingsRef.current.apiKey}`,
        },
        body: JSON.stringify({
          model: settingsRef.current.model,
          messages: settingsRef.current.systemPrompt
            ? [{ role: 'system', content: settingsRef.current.systemPrompt }, ...newMessages]
            : newMessages,
          stream: true,
        }),
      })
      if (!res.body) throw new Error('No response body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantReply = ''
      let buffer = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.replace('data: ', '')
          if (data === '[DONE]') {
            setLoading(false)
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices?.[0]?.delta?.content || ''
            if (text) {
              assistantReply += text
              setMessages(m => {
                const updated = [...m]
                updated[updated.length - 1] = { role: 'assistant', content: assistantReply }
                return updated
              })
            }
          } catch {}
        }
      }
      setLoading(false)
    } catch (e: any) {
      setLoading(false)
      setMessages(m => {
        const updated = [...m]
        updated[updated.length - 1] = { role: 'assistant', content: e.message }
        return updated
      })
    }
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="font-bold">{t.title}</h1>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button
            onClick={() => {
              setMessages([])
              if (typeof window !== 'undefined') {
                localStorage.removeItem('messages')
              }
            }}
            aria-label={t.clear}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label={t.toggleLang}>
            <Languages className="h-4 w-4" />
          </Button>
          <Button onClick={() => setOpen(true)} aria-label={t.settings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block max-w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
               <Markdown content={m.content} />
              {loading && i === messages.length - 1 && m.role === 'assistant' && (
                <Loader2 className="w-4 h-4 ml-1 inline animate-spin" />
              )}
            </div>
          </div>
        ))}
      </main>
      <form
        onSubmit={e => {
          e.preventDefault()
          sendMessage()
        }}
        className="flex gap-2 p-4"
      >
        <input
          className="flex-1 border rounded-md px-3 py-2 bg-white dark:bg-black"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.placeholder}
        />
        <Button type="submit" aria-label={t.send}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <SettingsDialog lang={lang} open={open} onOpenChange={setOpen} settingsRef={settingsRef} />
    </div>
  )
}
