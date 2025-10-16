import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string })?.from || '/admin'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username or email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsSubmitting(true)
    try {
      await login(username, password)
      // Redirect to the page they tried to visit or admin home
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="terminal-box p-8">
          <h1 className="text-2xl font-semibold mb-2 text-text">Admin Login</h1>
          <p className="text-text-muted text-sm mb-6">
            Enter your credentials to access the admin panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text
                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                placeholder="Enter username or email"
                aria-invalid={!!error}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text
                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                placeholder="Enter password"
                aria-invalid={!!error}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {error && (
              <div
                id="error-message"
                role="alert"
                aria-live="assertive"
                className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-accent text-crust font-medium rounded-lg
                       hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent
                       focus:ring-offset-2 focus:ring-offset-background
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            <p>Note: Backend auth endpoints are pending integration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
