'use client'

import { useEffect, useState, useRef } from 'react'
import type { ChatMessage as ChatMessageType, UsageInfo } from './types'
import ChatMessage from './ChatMessage'
import ChatStats from './ChatStats'

const STORAGE_KEY = 'laskmit-groq-chat'

const emptyUsage: UsageInfo = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}`
}

export default function ChatApp() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<UsageInfo>(emptyUsage)
  const [model, setModel] = useState('llama-3.1-8b-instant')
  const [responseTimeMs, setResponseTimeMs] = useState(0)
  const [tokensPerSecond, setTokensPerSecond] = useState(0)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      setMessages(saved.messages ?? [])
      setUsage(saved.usage ?? emptyUsage)
      setModel(saved.model ?? 'llama-3.1-8b-instant')
      setResponseTimeMs(saved.responseTimeMs ?? 0)
      setTokensPerSecond(saved.tokensPerSecond ?? 0)
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const payload = {
      messages,
      usage,
      model,
      responseTimeMs,
      tokensPerSecond,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [messages, usage, model, responseTimeMs, tokensPerSecond])

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || loading) return

    const newMessage: ChatMessageType = {
      id: createId(),
      role: 'user',
      text: trimmed,
    }

    const nextMessages = [...messages, newMessage]
    setMessages(nextMessages)
    setInputValue('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al conectar con la API de Groq')
      }

      const assistantMessage: ChatMessageType = {
        id: createId(),
        role: 'assistant',
        text: data.assistant || 'La respuesta no se recibió correctamente.',
      }

      setMessages((current) => [...current, assistantMessage])
      setUsage((current) => ({
        promptTokens: current.promptTokens + (data.usage?.promptTokens ?? 0),
        completionTokens: current.completionTokens + (data.usage?.completionTokens ?? 0),
        totalTokens: current.totalTokens + (data.usage?.totalTokens ?? 0),
      }))
      setModel(data.model ?? 'llama-3.1-8b-instant')
      setResponseTimeMs(data.responseTimeMs ?? 0)
      setTokensPerSecond(data.tokensPerSecond ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    setInputValue('')
    setError('')
    setUsage(emptyUsage)
    setModel('llama-3.1-8b-instant')
    setResponseTimeMs(0)
    setTokensPerSecond(0)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return
    // Jump to the bottom whenever messages change so the last message is visible
    try {
      el.scrollTop = el.scrollHeight
    } catch {
      // ignore
    }
  }, [messages])

  return (
    <div className="grid h-[calc(100vh-3rem)] lg:max-h-[calc(100vh-3rem)] lg:-mt-2 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex h-full min-h-0 flex-col panel p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.28em] text-[--on-surface-variant]">Chat de Groq</p>
            <button
              type="button"
              onClick={clearConversation}
              className="btn-clear text-xs px-3 py-2"
            >
              Borrar conversación
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden panel p-4">
            <div ref={messagesContainerRef} className="flex h-full flex-col gap-3 overflow-y-auto pr-1 text-sm leading-6 text-[--on-surface] scrollbar-thin">
              {messages.length === 0 ? (
                <div className="mt-12 text-center text-[--on-surface-variant]">
                  Empieza la conversación con un mensaje y la IA responderá.
                </div>
              ) : (
                messages.map((message) => <ChatMessage key={message.id} message={message} />)
              )}
            </div>
          </div>

          <form className="mt-4 flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-end" onSubmit={handleSend}>
            <label htmlFor="chat-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <textarea
              id="chat-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={1}
              className="textarea flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2 text-xs px-3 py-2 lg:ml-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 21L20 12L4 3V10L16 12L4 14V21Z" fill="currentColor" />
              </svg>
              {loading ? 'Pensando...' : 'Enviar'}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
        </section>

        <aside className="min-h-0 overflow-auto space-y-4">
          <ChatStats usage={usage} model={model} responseTimeMs={responseTimeMs} tokensPerSecond={tokensPerSecond} />
        </aside>
    </div>
  )
}
