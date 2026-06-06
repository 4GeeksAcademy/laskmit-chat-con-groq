import type { ChatMessage as ChatMessageType } from './types'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const alignment = isUser ? 'justify-end' : 'justify-start'
  const bubbleClass = isUser ? 'bubble user' : 'bubble assistant'

  return (
    <div className={`group flex ${alignment} py-1 sm:py-2`}>
      <div className={`max-w-[90%] ${bubbleClass}`}>
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
    </div>
  )
}
