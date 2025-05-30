import { ThemeDropdown } from '@/components' // adjust the path if needed
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="p-4 text-sm flex items-center justify-between uppercase tracking-wider bg-black text-white border-b border-neutral-800">
      <div className="flex gap-6">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/support">Support</NavLink>
      </div>

      <ThemeDropdown />
    </nav>
  )
}
