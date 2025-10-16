import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type AdminGateProps = {
  children: ReactNode
}

// Extremely simple gate: checks for a localStorage flag set by a prompt.
// In real apps, replace with proper auth (JWT/session).
const AdminGate = ({ children }: AdminGateProps) => {
  const [allowed, setAllowed] = useState<boolean>(false)
  const [asked, setAsked] = useState<boolean>(false)

  useEffect(() => {
    const already = localStorage.getItem('admin_ok') === 'true'
    if (already) {
      setAllowed(true)
      setAsked(true)
      return
    }
    // Prompt once per mount
    const token = window.prompt('Enter admin token:')
    const expected = import.meta.env.VITE_ADMIN_TOKEN || 'letmein'
    const ok = !!token && token === expected
    if (ok) localStorage.setItem('admin_ok', 'true')
    setAllowed(ok)
    setAsked(true)
  }, [])

  if (!asked) return null
  if (!allowed)
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access denied</h2>
        <p className="text-text-muted">Invalid token. Refresh to try again.</p>
      </div>
    )
  return <>{children}</>
}

export default AdminGate
