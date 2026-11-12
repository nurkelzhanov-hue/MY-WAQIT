import './switch.css'

type Props = {
  on: boolean
  onToggle: () => void
  label: string
}

export default function Switch({ on, onToggle, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={'switch' + (on ? ' on' : '')}
      onClick={onToggle}
    >
      <span className="switch-knob" />
    </button>
  )
}
