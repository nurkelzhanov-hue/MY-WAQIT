import PagePlaceholder from '../components/PagePlaceholder'
import { useLang } from '../hooks/useLang'

export default function AiPage() {
  const { t } = useLang()
  return <PagePlaceholder title={t.nav.ai} />
}
