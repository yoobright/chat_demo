'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SettingsDialog } from '@/components/settings-dialog'
import { ThemeToggle } from '@/components/theme-toggle'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'zh'>('en')
  const settingsRef = useRef({ apiBase: '', apiKey: '', model: 'gpt-3.5-turbo' })

  const t = {
    en: {
      title: 'Chat Demo',
      settings: 'Settings',
      placeholder: 'Send a message',
      send: 'Send',
      toggleLang: '中文',
    },
    zh: {
      title: '聊天演示',
      settings: '设置',
      placeholder: '发送消息',
      send: '发送',
      toggleLang: 'EN',
    },
  }[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const sendMessage = async () => {
    if (!input) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    try {
      const res = await fetch(`${settingsRef.current.apiBase}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settingsRef.current.apiKey}`,
        },
        body: JSON.stringify({
          model: settingsRef.current.model,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'No response'
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (e: any) {
      setMessages(m => [...m, { role: 'assistant', content: e.message }])
    }
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="font-bold">{t.title}</h1>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>{t.toggleLang}</Button>
          <Button onClick={() => setOpen(true)}>{t.settings}</Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {m.content}
            </div>
          </div>
        ))}
      </main>
      <form
        onSubmit={e => {
          e.preventDefault()
          sendMessage()
        }}
        className="flex gap-2 p-4 border-t"
      >
        <input
          className="flex-1 border rounded-md px-3 py-2 bg-white dark:bg-black"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.placeholder}
        />
        <Button type="submit">{t.send}</Button>
      </form>
      <SettingsDialog lang={lang} open={open} onOpenChange={setOpen} settingsRef={settingsRef} />
    </div>
  )
}
