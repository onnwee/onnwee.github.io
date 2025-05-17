import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="p-4 text-sm flex gap-6 uppercase tracking-wider bg-black text-white border-b border-neutral-800">
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/about">About</Link>
      <Link to="/support">Support</Link>
    </nav>
  )
}
