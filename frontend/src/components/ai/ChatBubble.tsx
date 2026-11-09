import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

type Props = {
  role: 'user' | 'assistant'
  children: ReactNode
}

export default function ChatBubble({ role, children }: Props) {
  return (
    <div className={'bubble-row ' + role}>
      {role === 'assistant' && (
        <span className="bubble-avatar">
          <Sparkles size={16} />
        </span>
      )}
      <div className="bubble">{children}</div>
    </div>
  )
}
