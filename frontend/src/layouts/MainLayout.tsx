import { Navigate, Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useLang } from '../hooks/useLang'

export default function MainLayout() {
  const { lang } = useLang()

  if (lang === null) {
    return <Navigate to="/welcome" replace />
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
