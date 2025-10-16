import type { ReactNode } from 'react'
import { EmbedWrapper } from './embedWrappers'

type EmbedProps = {
  url: string
  title?: string
}

const baseClass = 'h-full w-full rounded-2xl border-0'

const wrap = (content: ReactNode) => (
  <div className="surface-card overflow-hidden px-4 py-4">{content}</div>
)

// Helper: Get emoji/logo for fallback
const getPlatformMeta = (url: string) => {
  if (url.includes('twitter.com')) return { name: 'Twitter', emoji: '🐦' }
  if (url.includes('bsky.app')) return { name: 'Bluesky', emoji: '🟦' }
  if (url.includes('instagram.com')) return { name: 'Instagram', emoji: '📸' }
  if (url.includes('tiktok.com')) return { name: 'TikTok', emoji: '🎵' }
  if (url.includes('bandcamp.com')) return { name: 'Bandcamp', emoji: '🎶' }
  if (url.includes('twitch.tv')) return { name: 'Twitch', emoji: '🟣' }
  // X?
  return { name: 'Link', emoji: '🔗' }
}

// Fallback block for unsupported embeds
const fallbackCard = (url: string, title?: string) => {
  const { name, emoji } = getPlatformMeta(url)
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface/60 px-6 py-8 text-center text-sm text-text-muted">
      <span className="text-3xl">{emoji}</span>
      <p className="text-base font-medium text-text">Unable to embed {name}</p>
      <p className="text-xs text-text-muted/80">
        The service might require an authenticated session or does not allow embedding.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
      >
        Open {title || name} ↗
      </a>
    </div>
  )
}

// Main embed renderer
export const renderEmbed = ({ url, title }: EmbedProps) => {
  const embedClass = `${baseClass} bg-surface-strong/60`

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return wrap(
      <EmbedWrapper>
        <iframe
          src={url}
          title={title || 'YouTube Embed'}
          className={embedClass}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </EmbedWrapper>,
    )
  }

  if (url.includes('spotify.com')) {
    return wrap(
      <EmbedWrapper heightClass="h-20">
        <iframe
          src={url}
          title={title || 'Spotify Embed'}
          className={embedClass}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </EmbedWrapper>,
    )
  }

  if (url.includes('soundcloud.com')) {
    return wrap(
      <EmbedWrapper heightClass="h-[166px]">
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={url}
          title={title || 'SoundCloud Embed'}
          className={embedClass}
        />
      </EmbedWrapper>,
    )
  }

  if (url.includes('twitch.tv')) {
    const match = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/)
    const channel = match?.[1]
    return channel
      ? wrap(
          <EmbedWrapper>
            <iframe
              src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
              allowFullScreen
              className={embedClass}
              title={`${title || 'Twitch Embed'} (${channel})`}
            />
          </EmbedWrapper>,
        )
      : wrap(fallbackCard(url, title))
  }

  if (url.includes('bandcamp.com')) {
    return wrap(
      <EmbedWrapper>
        <iframe title={title || 'Bandcamp Embed'} className={embedClass} src={url} seamless />
      </EmbedWrapper>,
    )
  }

  // Unsupported embeds = fallback
  if (
    url.includes('twitter.com') ||
    url.includes('bsky.app') ||
    url.includes('instagram.com') ||
    url.includes('tiktok.com')
  ) {
    return wrap(fallbackCard(url, title))
  }

  // Default fallback
  return wrap(fallbackCard(url, title))
}
