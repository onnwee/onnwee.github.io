import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

const AdminLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-text-muted">Logged in as {user.username}</span>}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-surface hover:bg-surface-strong border border-border rounded-lg text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <nav className="mb-6 flex gap-4 text-sm">
        <NavLink
          to="projects"
          className={({ isActive }) => (isActive ? 'text-accent' : 'text-text-muted')}
        >
          Projects
        </NavLink>
        <NavLink
          to="posts"
          className={({ isActive }) => (isActive ? 'text-accent' : 'text-text-muted')}
        >
          Posts
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default AdminLayout
