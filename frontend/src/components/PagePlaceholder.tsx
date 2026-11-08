import { useLang } from '../hooks/useLang'

type Props = { title: string }

export default function PagePlaceholder({ title }: Props) {
  const { t } = useLang()

  return (
    <section className="page">
      <h1 className="page-title">{title}</h1>
      <div className="card">
        <p className="muted">{t.placeholder}</p>
      </div>
    </section>
  )
}
