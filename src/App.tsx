import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Workplaces } from './pages/Workplaces'
import { AddHours } from './pages/AddHours'

export function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink/50">
        Loading…
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-sand/40">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hours" element={<AddHours />} />
          <Route path="/workplaces" element={<Workplaces />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
