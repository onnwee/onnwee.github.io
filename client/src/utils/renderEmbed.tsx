import { EmbedWrapper } from './embedWrappers'

type EmbedProps = {
  url: string
  title?: string
  glitchMode?: boolean
}

const baseClass = 'rounded w-full h-full'

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
const fallbackCard = (url: string, title?: string, glitchMode?: boolean) => {
  const { name, emoji } = getPlatformMeta(url)
  return (
    <div
      className={`p-4 text-center text-sm font-mono border rounded backdrop-blur-sm bg-white/5
        ${glitchMode ? 'glitch-box' : 'clean-box'}`}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="mb-2">Unable to embed {name}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-glitchBlue hover:text-accent"
      >
        Open {title || name} in a new tab →
      </a>
    </div>
  )
}

// Main embed renderer
export const renderEmbed = ({ url, title, glitchMode }: EmbedProps) => {
  const embedClass = `${baseClass} ${glitchMode ? 'glitch-box' : 'clean-box'}`

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return (
      <EmbedWrapper>
        <iframe
          src={url}
          title={title || 'YouTube Embed'}
          className={embedClass}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </EmbedWrapper>
    )
  }

  if (url.includes('spotify.com')) {
    return (
      <EmbedWrapper heightClass="h-20 mb-6">
        <iframe
          src={url}
          title={title || 'Spotify Embed'}
          className={embedClass}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </EmbedWrapper>
    )
  }

  if (url.includes('soundcloud.com')) {
    return (
      <EmbedWrapper heightClass="h-[166px] mb-6">
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
      </EmbedWrapper>
    )
  }

  if (url.includes('twitch.tv')) {
    const match = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/)
    const channel = match?.[1]
    return channel ? (
      <EmbedWrapper>
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
          allowFullScreen
          className={embedClass}
          title={`${title || 'Twitch Embed'} (${channel})`}
        />
      </EmbedWrapper>
    ) : (
      fallbackCard(url, title, glitchMode)
    )
  }

  if (url.includes('bandcamp.com')) {
    return (
      <EmbedWrapper>
        <iframe title={title || 'Bandcamp Embed'} className={embedClass} src={url} seamless />
      </EmbedWrapper>
    )
  }

  // Unsupported embeds = fallback
  if (
    url.includes('twitter.com') ||
    url.includes('bsky.app') ||
    url.includes('instagram.com') ||
    url.includes('tiktok.com')
  ) {
    return fallbackCard(url, title, glitchMode)
  }

  // Default fallback
  return fallbackCard(url, title, glitchMode)
}
