import { useEffect, useRef, useState } from 'react'
import { Mic, Send, Sparkles } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { pickGreeting } from '../utils/greeting'
import ChatBubble from '../components/ai/ChatBubble'
import VoicePanel from '../components/ai/VoicePanel'
import './ai.css'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

export default function AiPage() {
  const { t } = useLang()
  const now = useNow(DEFAULT_TIMEZONE)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [voiceMode, setVoiceMode] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // The real AI is connected in a later stage; until then every message gets a placeholder reply.
  const addReply = (prefix: Message[]) => {
    const reply: Message = { id: nextId.current++, role: 'assistant', text: t.ai.pendingReply }
    setMessages((prev) => [...prev, ...prefix, reply])
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (trimmed === '') return
    const userMessage: Message = { id: nextId.current++, role: 'user', text: trimmed }
    addReply([userMessage])
    setInput('')
  }

  if (voiceMode) {
    return (
      <section className="ai-page">
        <h1 className="ai-title">{t.ai.title}</h1>
        <VoicePanel
          onCancel={() => setVoiceMode(false)}
          onConfirm={() => {
            setVoiceMode(false)
            addReply([])
          }}
        />
      </section>
    )
  }

  const chips = [t.ai.chipAddTask, t.ai.chipToday, t.ai.chipTomorrow, t.ai.chipPrayer]

  return (
    <section className="ai-page">
      <h1 className="ai-title">{t.ai.title}</h1>

      <div className="chat-messages">
        <ChatBubble role="assistant">
          <strong>{pickGreeting(now.hour, t.home)}</strong>
          <br />
          {t.ai.intro}
        </ChatBubble>

        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role}>
            {m.text}
          </ChatBubble>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-footer">
        <div className="chips">
          {chips.map((label) => (
            <button key={label} className="chip-button" onClick={() => send(label)}>
              {label}
            </button>
          ))}
        </div>

        <div className="chat-input-bar">
          <Sparkles size={18} className="chat-input-icon" />
          <input
            className="chat-input"
            value={input}
            placeholder={t.ai.placeholder}
            enterKeyHint="send"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send(input)
            }}
          />
          {input.trim() === '' ? (
            <button className="chat-action" onClick={() => setVoiceMode(true)} aria-label={t.ai.voice}>
              <Mic size={18} />
            </button>
          ) : (
            <button className="chat-action" onClick={() => send(input)} aria-label={t.ai.send}>
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
