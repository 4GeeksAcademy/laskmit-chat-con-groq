export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
}

export interface UsageInfo {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}
