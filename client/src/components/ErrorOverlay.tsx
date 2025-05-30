import { errorMonitor } from '@/utils'
import { useEffect, useState } from 'react'

const ErrorOverlay = () => {
  const [errors, setErrors] = useState(() => errorMonitor.getRecentErrors())
  const [expanded, setExpanded] = useState<number | null>(null)

  // Poll for updates (or use a custom event system later)
  useEffect(() => {
    const interval = setInterval(() => {
      setErrors(errorMonitor.getRecentErrors())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (import.meta.env.NODE_ENV !== 'development' || errors.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[60vh] overflow-y-auto shadow-lg border border-red-500 bg-neutral text-sm text-red-200 rounded-md p-4 font-mono backdrop-blur-md">
      <div className="flex justify-between items-center mb-2">
        <strong className="text-red-400">🚨 Dev Error Overlay</strong>
        <button
          onClick={() => {
            errorMonitor.clearErrors()
            setErrors([])
          }}
          className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>

      {errors.map((err, index) => (
        <div key={index} className="mb-3 border-t border-red-800 pt-2">
          <div className="flex justify-between items-start">
            <span className="font-semibold">{err.context.component}</span>
            <span className="text-xs opacity-60">
              {err.context.timestamp.split('T')[1].slice(0, 8)}
            </span>
          </div>
          <div className="text-red-300 text-xs mb-1">{err.message}</div>

          <button
            onClick={() => setExpanded(expanded === index ? null : index)}
            className="text-xs underline text-glitchBlue"
          >
            {expanded === index ? 'Hide Stack' : 'Show Stack'}
          </button>

          {expanded === index && err.stack && (
            <pre className="mt-1 bg-black/50 p-2 rounded overflow-x-auto text-xs whitespace-pre-wrap">
              {err.stack}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

export default ErrorOverlay
