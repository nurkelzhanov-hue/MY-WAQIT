import type { ReactNode } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'
import HourglassMark from './art/HourglassMark'
import './app-header.css'

type Props = {
  subtitle: string
  left?: 'menu' | 'back' | 'none'
  onLeft?: () => void
  right?: ReactNode
}

export default function AppHeader({ subtitle, left = 'none', onLeft, right }: Props) {
  return (
    <header className="app-header">
      <div className="app-header-side">
        {left !== 'none' && (
          <button className="icon-btn" onClick={onLeft} aria-label={left === 'back' ? 'Back' : 'Menu'}>
            {left === 'back' ? <ArrowLeft size={26} /> : <Menu size={26} />}
          </button>
        )}
      </div>
      <div className="app-header-brand">
        <HourglassMark size={36} />
        <div className="app-header-text">
          <span className="app-header-title">MY WAQIT</span>
          <span className="app-header-sub">{subtitle}</span>
        </div>
      </div>
      <div className="app-header-side right">{right}</div>
    </header>
  )
}
