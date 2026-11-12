import './dialog.css'

type Props = {
  text: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ text, confirmLabel, cancelLabel, onConfirm, onCancel }: Props) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p className="dialog-text">{text}</p>
        <div className="dialog-actions">
          <button className="dialog-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="dialog-btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
