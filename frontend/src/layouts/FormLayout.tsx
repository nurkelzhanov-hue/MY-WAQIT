import { Navigate, Outlet } from 'react-router-dom'
import { useLang } from '../hooks/useLang'

// Layout for form screens: same language guard as MainLayout, but no bottom menu.
export default function FormLayout() {
  const { lang } = useLang()

  if (lang === null) {
    return <Navigate to="/welcome" replace />
  }

  return (
    <div className="app-shell form-shell">
      <Outlet />
    </div>
  )
}
