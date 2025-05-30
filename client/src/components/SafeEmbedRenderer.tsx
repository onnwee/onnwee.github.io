import { SafeEmbedWrapper } from '@/components'
import { validateEmbedUrl } from '@/utils'

const SafeEmbedRenderer = ({
  url,
  title,
  glitchMode,
}: {
  url: string
  title?: string
  glitchMode?: boolean
}) => {
  const validation = validateEmbedUrl(url)
  if (!validation.isValid) {
    return (
      <div
        className={`p-4 text-center text-sm font-mono border rounded ${
          glitchMode ? 'border-glitchRed text-glitchRed' : 'border-red-400 text-red-300'
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-2xl mb-2">🚫</div>
        <div className="mb-2">Invalid Embed URL</div>
        <div className="text-xs opacity-60">{validation.error}</div>
      </div>
    )
  }

  return (
    <SafeEmbedWrapper url={url} title={title}>
      <iframe
        src={url}
        title={title || 'Embedded Content'}
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </SafeEmbedWrapper>
  )
}

export default SafeEmbedRenderer
