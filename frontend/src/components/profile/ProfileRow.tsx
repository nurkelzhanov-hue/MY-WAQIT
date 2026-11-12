import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

type Props = {
  icon: ReactNode
  label: string
  value?: string
  danger?: boolean
  showChevron?: boolean
  onClick?: () => void
}

export default function ProfileRow({ icon, label, value, danger, showChevron = true, onClick }: Props) {
  return (
    <button className={'profile-row' + (danger ? ' danger' : '')} onClick={onClick}>
      <span className="profile-row-icon">{icon}</span>
      <span className="profile-row-label">{label}</span>
      {value && <span className="profile-row-value">{value}</span>}
      {showChevron && <ChevronRight size={18} className="profile-row-chevron" />}
    </button>
  )
}
