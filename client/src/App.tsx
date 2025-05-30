import { ErrorBoundary, ErrorOverlay, Nav, ThemeToggle } from '@/components'
import { About, Blog, BlogPost, Home, ProjectDetail, Projects, Support } from '@/pages'
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
          <Route path="/projects" element={<Projects />} />
          {/* ProjectDetail has its own internal error handling, but this provides an extra safety net */}
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
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
      </ErrorBoundary>
    </>
  )
}

export default App
