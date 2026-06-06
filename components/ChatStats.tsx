import type { UsageInfo } from './types'

interface ChatStatsProps {
  usage: UsageInfo
  model: string
  responseTimeMs: number
  tokensPerSecond: number
}

export default function ChatStats({ usage, model, responseTimeMs, tokensPerSecond }: ChatStatsProps) {
  return (
    <section className="stats-card p-5 text-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[--on-surface-variant]">Modelo</p>
        <p className="mt-1 font-semibold text-[--on-surface]">{model}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mt-4">
        <div className="rounded-3xl p-3" style={{background:'var(--surface-container)'}}>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[--on-surface-variant]">Prompt tokens</p>
          <p className="mt-2 text-lg font-semibold text-[--on-surface]">{usage.promptTokens}</p>
        </div>
        <div className="rounded-3xl p-3" style={{background:'var(--surface-container)'}}>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[--on-surface-variant]">Completion tokens</p>
          <p className="mt-2 text-lg font-semibold text-[--on-surface]">{usage.completionTokens}</p>
        </div>
      </div>

      <div className="rounded-3xl p-3 mt-4" style={{background:'var(--surface-container)'}}>
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[--on-surface-variant]">Consumo total</p>
        <p className="mt-2 text-2xl font-semibold text-[--on-surface]">{usage.totalTokens}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mt-4">
        <div className="rounded-3xl p-3" style={{background:'var(--surface-container)'}}>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[--on-surface-variant]">Tiempo de respuesta</p>
          <p className="mt-2 text-lg font-semibold text-[--on-surface]">{responseTimeMs.toLocaleString()} ms</p>
        </div>
        <div className="rounded-3xl p-3" style={{background:'var(--surface-container)'}}>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[--on-surface-variant]">Tokens / segundo</p>
          <p className="mt-2 text-lg font-semibold text-[--on-surface]">{tokensPerSecond}</p>
        </div>
      </div>
    </section>
  )
}
