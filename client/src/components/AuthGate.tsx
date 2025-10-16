import { useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'

type AuthGateProps = {
  children: ReactNode
}

/**
 * AuthGate ensures the user is authenticated before rendering children.
 * If not authenticated, redirects to /admin/login with the current location.
 */
const AuthGate = ({ children }: AuthGateProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login, saving the location they tried to visit
      navigate('/admin/login', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AuthGate
