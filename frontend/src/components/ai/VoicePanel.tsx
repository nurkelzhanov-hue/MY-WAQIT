import { useEffect, useState } from 'react'
import { Check, Mic, X } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { pad2 } from '../../utils/datetime'

type Props = {
  onCancel: () => void
  onConfirm: () => void
}

const BARS = Array.from({ length: 28 }, (_, i) => i)

// UI only: the timer and animation run, but no audio is recorded yet.
export default function VoicePanel({ onCancel, onConfirm }: Props) {
  const { t } = useLang()
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="voice-panel">
      <div className="wave">
        {BARS.map((i) => (
          <span
            key={i}
            className="wave-bar"
            style={{ animationDelay: `${(i % 7) * 0.12}s`, height: `${14 + ((i * 11) % 34)}px` }}
          />
        ))}
      </div>
      <p className="voice-prompt">{t.ai.voicePrompt}</p>
      <div className="voice-controls">
        <button className="voice-side" onClick={onCancel} aria-label={t.ai.cancel}>
          <X size={20} />
        </button>
        <span className="voice-mic">
          <Mic size={30} />
        </span>
        <button className="voice-side" onClick={onConfirm} aria-label={t.ai.confirm}>
          <Check size={20} />
        </button>
      </div>
      <p className="voice-timer">
        {Math.floor(seconds / 60)}:{pad2(seconds % 60)}
      </p>
    </div>
  )
}
