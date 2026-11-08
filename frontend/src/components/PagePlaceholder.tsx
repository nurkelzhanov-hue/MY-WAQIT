import { kaa } from '../i18n/kaa'

type Props = { title: string }

export default function PagePlaceholder({ title }: Props) {
  return (
    <section className="page">
      <h1 className="page-title">{title}</h1>
      <div className="card">
        <p className="muted">{kaa.placeholder}</p>
      </div>
    </section>
  )
}
