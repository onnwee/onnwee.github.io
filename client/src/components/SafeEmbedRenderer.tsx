import { SafeEmbedWrapper } from '@/components'
import { validateEmbedUrl } from '@/utils'

const SafeEmbedRenderer = ({ url, title }: { url: string; title?: string }) => {
  const validation = validateEmbedUrl(url)
  if (!validation.isValid) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-3xl border border-border/35 bg-surface/70 px-6 py-6 text-center text-sm text-text-muted shadow-soft"
        role="alert"
        aria-live="assertive"
      >
        <span className="text-2xl">🚫</span>
        <p className="text-base font-medium text-text">Invalid embed URL</p>
        <p className="text-xs text-text-muted/80">{validation.error}</p>
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
