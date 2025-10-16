import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type User = {
  id: number
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  sessionToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  // eslint-disable-next-line no-unused-vars
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_TOKEN_KEY = 'auth_session_token'
const USER_KEY = 'auth_user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(SESSION_TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setSessionToken(storedToken)
        setUser(parsedUser)
      } catch {
        // Clear invalid data - error intentionally ignored
        localStorage.removeItem(SESSION_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call once backend auth endpoints are ready
      // For now, simulate successful login with mock data
      // The backend endpoints mentioned in the issue are not yet available
      
      // Mock validation (remove when backend is ready)
      if (!username || !password) {
        throw new Error('Username and password are required')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock successful response
      const mockUser: User = {
        id: 1,
        username,
        email: `${username}@example.com`,
      }
      const mockToken = `mock-session-${Date.now()}`

      // Store in state and localStorage
      setSessionToken(mockToken)
      setUser(mockUser)
      localStorage.setItem(SESSION_TOKEN_KEY, mockToken)
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    } catch (error) {
      setSessionToken(null)
      setUser(null)
      localStorage.removeItem(SESSION_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    // TODO: Call backend logout endpoint when available
    setSessionToken(null)
    setUser(null)
    localStorage.removeItem(SESSION_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      sessionToken,
      isAuthenticated: !!sessionToken && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, sessionToken, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
