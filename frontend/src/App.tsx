import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import WelcomePage from './pages/WelcomePage'
import LanguagePage from './pages/LanguagePage'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import AiPage from './pages/AiPage'
import RemindersPage from './pages/RemindersPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="language" element={<LanguagePage />} />
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="ai" element={<AiPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
