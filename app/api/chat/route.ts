import { NextResponse } from 'next/server'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

interface ApiMessage {
  role: string
  text: string
}

interface GroqUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
}

function parseAssistantText(response: any): string {
  if (!response) {
    return ''
  }

  if (typeof response.output_text === 'string') {
    return response.output_text.trim()
  }

  if (Array.isArray(response.output) && response.output.length > 0) {
    const item = response.output[0]
    if (typeof item === 'string') {
      return item.trim()
    }
    if (item?.content) {
      if (typeof item.content === 'string') {
        return item.content.trim()
      }
      if (Array.isArray(item.content)) {
        return item.content
          .map((segment: any) => {
            if (typeof segment === 'string') return segment
            if (typeof segment?.text === 'string') return segment.text
            return ''
          })
          .join('')
          .trim()
      }
    }
  }

  if (Array.isArray(response.choices) && response.choices.length > 0) {
    const choice = response.choices[0]
    if (typeof choice.text === 'string') {
      return choice.text.trim()
    }
    if (choice?.message?.content) {
      return String(choice.message.content).trim()
    }
  }

  if (typeof response.response === 'string') {
    return response.response.trim()
  }

  return ''
}

function parseUsage(response: any): { promptTokens: number; completionTokens: number; totalTokens: number } {
  const raw: GroqUsage = response.usage ?? {}
  const prompt = Number(raw.prompt_tokens ?? raw.promptTokens ?? 0)
  const completion = Number(raw.completion_tokens ?? raw.completionTokens ?? 0)
  const total = Number(raw.total_tokens ?? raw.totalTokens ?? prompt + completion)

  return {
    promptTokens: Number.isNaN(prompt) ? 0 : prompt,
    completionTokens: Number.isNaN(completion) ? 0 : completion,
    totalTokens: Number.isNaN(total) ? prompt + completion : total,
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: 'Solicitud inválida: se requiere el historial de mensajes.' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'La API Key de Groq no está configurada en las variables de entorno.' },
      { status: 500 },
    )
  }

  const messages = body.messages.map((message: ApiMessage) => ({
    role: message.role,
    content: message.text,
  }))

  const payload = {
    model,
    messages,
    max_tokens: 512,
    temperature: 0.2,
  }

  const startTime = Date.now()
  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  const responseBody = await response.json().catch(() => null)
  const duration = Date.now() - startTime

  if (!response.ok) {
    const apiError = responseBody?.error?.message || responseBody?.error || 'Error en la API de Groq'
    return NextResponse.json({ error: apiError }, { status: response.status })
  }

  const assistantText = parseAssistantText(responseBody)
  const usage = parseUsage(responseBody)
  const tokensPerSecond = usage.totalTokens > 0 ? Math.round((usage.totalTokens * 1000) / Math.max(duration, 1)) : 0

  return NextResponse.json({
    assistant: assistantText,
    usage,
    model,
    responseTimeMs: duration,
    tokensPerSecond,
  })
}
