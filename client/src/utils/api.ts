export type ApiProject = {
  id: number
  title: string
  slug: string
  description?: string | null
  repo_url?: string | null
  live_url?: string | null
  // Frontend-aligned fields now present in DB
  summary?: string | null
  tags?: string[]
  footer?: string | null
  href?: string | null
  external?: boolean
  color?: string | null
  emoji?: string | null
  content?: string | null
  image?: string | null
  embed?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type ApiPost = {
  id: number
  title: string
  slug: string
  content?: string | null
  summary?: string | null
  tags?: string[] | null
  published?: boolean
  created_at?: string
  updated_at?: string
}

const base = '/api'

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

// Projects
export const ProjectsApi = {
  list: () => fetch(`${base}/projects`).then(json<ApiProject[]>),
  create: (payload: Partial<ApiProject>) =>
    fetch(`${base}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<ApiProject>),
  update: (id: number, payload: Partial<ApiProject>) =>
    fetch(`${base}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<ApiProject>),
  delete: (id: number) =>
    fetch(`${base}/projects/${id}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error(`${res.status}`)
    }),
}

// Posts
export const PostsApi = {
  list: (limit = 10, offset = 0) =>
    fetch(`${base}/posts?limit=${limit}&offset=${offset}`).then(json<ApiPost[]>),
  getBySlug: (slug: string) =>
    fetch(`${base}/posts/${encodeURIComponent(slug)}`).then(json<ApiPost>),
  create: (payload: Partial<ApiPost>) =>
    fetch(`${base}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<ApiPost>),
  update: (id: number, payload: Partial<ApiPost>) =>
    fetch(`${base}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json<ApiPost>),
  delete: (id: number) =>
    fetch(`${base}/posts/${id}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error(`${res.status}`)
    }),
}
