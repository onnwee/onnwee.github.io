import { NavLink, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
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
