import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import FormLayout from './layouts/FormLayout'
import WelcomePage from './pages/WelcomePage'
import LanguagePage from './pages/LanguagePage'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import AiPage from './pages/AiPage'
import RemindersPage from './pages/RemindersPage'
import ProfilePage from './pages/ProfilePage'
import NewTaskPage from './pages/NewTaskPage'
import PrayerPage from './pages/PrayerPage'
import TariffPage from './pages/TariffPage'
import StatsPage from './pages/StatsPage'
import DebugPage from './pages/DebugPage'
import TasksProvider from './data/TasksProvider'
import './styles/theme.css'

export default function App() {
  return (
    <TasksProvider>
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="language" element={<LanguagePage />} />
      <Route element={<FormLayout />}>
        <Route path="new-task" element={<NewTaskPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="ai" element={<AiPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="prayer" element={<PrayerPage />} />
        <Route path="tariff" element={<TariffPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="debug" element={<DebugPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </TasksProvider>
  )
}
