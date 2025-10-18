import { AuthGate, ErrorBoundary, ErrorOverlay, Nav } from '@/components'
import { About, Home, ProjectDetail, Projects, Support } from '@/pages'
// import { BlogPost } from '@/pages' // Uncomment when blog route is enabled
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminProjects from '@/pages/admin/AdminProjects'
import AdminPosts from '@/pages/admin/AdminPosts'
import AdminLogin from '@/pages/admin/AdminLogin'
import { errorMonitor } from '@/utils'

import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <>
      {import.meta.env.NODE_ENV === 'development' && <ErrorOverlay />}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 bg-black text-white px-4 py-2 rounded"
      >
        Skip to content
      </a>
      {/* Wrap navigation in its own error boundary */}
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <div
            className="p-4 bg-red-900 text-red-100 text-center"
            role="alert"
            aria-live="assertive"
          >
            <span className="text-sm">Navigation error: {error?.message}</span>
            <button onClick={reset} className="ml-2 px-2 py-1 bg-red-700 rounded text-xs">
              Retry
            </button>
          </div>
        )}
        onError={(error, errorInfo) => {
          errorMonitor.logReactError(error, errorInfo, 'NavigationError', 'high')
        }}
      >
        <Nav />
      </ErrorBoundary>

      {/* Wrap main application routes in error boundary */}
      <ErrorBoundary
        onError={(error, errorInfo) => {
          errorMonitor.logReactError(error, errorInfo, 'App', 'high')
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/projects"
            element={
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  errorMonitor.logReactError(error, errorInfo, 'Projects', 'high')
                }}
              >
                <Projects />
              </ErrorBoundary>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  errorMonitor.logReactError(error, errorInfo, 'ProjectDetail', 'high')
                }}
              >
                <ProjectDetail />
              </ErrorBoundary>
            }
          />
          {/* Blog temporarily disabled - uncomment when ready */}
          {/*
          <Route
            path="/blog/:slug"
            element={
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  errorMonitor.logReactError(error, errorInfo, 'BlogPost', 'high')
                }}
              >
                <BlogPost />
              </ErrorBoundary>
            }
          />
          */}
          {/* Admin routes (not linked from nav) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AuthGate>
                <AdminLayout />
              </AuthGate>
            }
          >
            <Route index element={<AdminProjects />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="posts" element={<AdminPosts />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </ErrorBoundary>

      {/* Wrap theme toggle in its own boundary */}
      <ErrorBoundary
        fallback={({ reset }) => (
          <div
            className="fixed bottom-4 right-4 z-50 p-2 bg-red-900 text-red-100 rounded"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-xs mb-1">Theme controls error</div>
            <button onClick={reset} className="text-xs px-2 py-1 bg-red-700 rounded">
              Reset
            </button>
          </div>
        )}
        onError={(error, errorInfo) => {
          errorMonitor.logReactError(error, errorInfo, 'ThemeToggle', 'low')
        }}
      >
        {/* <ThemeToggle /> */}
        <></>
      </ErrorBoundary>
    </>
  )
}

export default App
