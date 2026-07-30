import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive ? 'bg-forest text-sand' : 'text-ink/70 hover:bg-forest/10'
  }`

export function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
      <span className="font-display text-lg font-semibold text-forest">PCE Hours</span>
      <div className="flex items-center gap-1">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/hours" className={linkClass}>Log Hours</NavLink>
        <NavLink to="/workplaces" className={linkClass}>Workplaces</NavLink>
        <button
          onClick={() => signOut()}
          className="ml-2 px-3 py-2 rounded-full text-sm font-medium text-clay hover:bg-clay/10"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
