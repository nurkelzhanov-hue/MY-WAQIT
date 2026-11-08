import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function MainLayout() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
