type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  footer?: string
  href?: string
  external?: boolean
  color?: 'green' | 'pink' | 'cyan' | 'yellow'
  emoji?: string
  content?: string // used in detail view
  image?: string // e.g., '/images/project-name.jpg' or external URL
  embed?: string // e.g., YouTube, CodePen, etc.
}

export const projects: Project[] = [
  {
    slug: 'twitch-chat-insights',
    title: 'Twitch Chat Insights',
    emoji: '📊',
    summary: 'A Twitch analytics tool to search and analyze livestream chats.',
    tags: ['React', 'Twitch API', 'Meilisearch'],
    footer: 'source available',
    href: 'https://github.com/onnwee/twitch-chat-insights',
    external: true,
    color: 'cyan',
    content: `This tool pulls and analyzes Twitch chat in near real-time. It supports Meilisearch indexing and basic analytics for viewer engagement, emotes, and reactions.`,
  },
  {
    slug: 'llm-punctuator',
    title: 'LLM Punctuator',
    emoji: '🧪',
    summary: 'Cleans up AI-generated transcripts using Docker + deepmultilingualpunctuation.',
    tags: ['Python', 'Docker', 'Transcripts'],
    footer: 'run it locally',
    href: 'https://github.com/onnwee/llm-punctuator',
    external: true,
    color: 'pink',
    content: `Uses the deepmultilingualpunctuation model to restore punctuation to Whisper-generated text. Packaged as a Docker container for clean local use.`,
  },
  {
    slug: 'subreddit-explorer',
    title: 'Subreddit Explorer',
    emoji: '🕸',
    summary: 'Crawls Reddit communities and maps connections using shared users and topics.',
    tags: ['Node.js', 'GraphQL', 'PostgreSQL'],
    footer: 'demo & source',
    href: '/projects/subreddit-explorer',
    external: false,
    color: 'yellow',
    content: `This app analyzes subreddit networks by user activity. It builds a graph and lets you explore ideological clusters and community bridges.`,
  },
]
