import { useEffect, useMemo, useState } from 'react'
import { ProjectsApi, type ApiProject } from '@/utils/api'

type Project = ApiProject

const emptyProject: Project = { id: 0, slug: '', title: '' }

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<Project>(emptyProject)
  const [error, setError] = useState<string | null>(null)
  const isEditing = useMemo(() => editingIndex !== null, [editingIndex])

  useEffect(() => {
    ProjectsApi.list()
      .then(setProjects)
      .catch(e => setError(e.message))
  }, [])

  const startCreate = () => {
    setEditingIndex(null)
    setDraft(emptyProject)
  }

  const startEdit = (idx: number) => {
    setEditingIndex(idx)
    setDraft(projects[idx])
  }

  const remove = async (idx: number) => {
    const item = projects[idx]
    const prev = [...projects]
    setProjects(p => p.filter((_, i) => i !== idx))
    try {
      await ProjectsApi.delete(item.id)
    } catch (e: any) {
      setProjects(prev)
      setError(e.message)
    }
    if (editingIndex === idx) {
      setEditingIndex(null)
    }
  }

  const save = async () => {
    setError(null)
    try {
      if (editingIndex === null) {
        const created = await ProjectsApi.create({
          title: draft.title,
          slug: draft.slug,
          description: draft.description ?? null,
          repo_url: draft.repo_url ?? null,
          live_url: draft.live_url ?? null,
        })
        setProjects(prev => [created, ...prev])
      } else {
        const updated = await ProjectsApi.update(draft.id, {
          title: draft.title,
          description: draft.description ?? null,
          repo_url: draft.repo_url ?? null,
          live_url: draft.live_url ?? null,
        })
        setProjects(prev => prev.map((p, i) => (i === editingIndex ? updated : p)))
      }
      setEditingIndex(null)
      setDraft(emptyProject)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <button onClick={startCreate} className="chip">
            New
          </button>
        </div>
        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        <ul className="divide-y divide-border/30 rounded border border-border/40 bg-surface/70">
          {projects.map((p, idx) => (
            <li key={p.slug || idx} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-text-muted">/{p.slug}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(idx)} className="chip">
                  Edit
                </button>
                <button onClick={() => remove(idx)} className="chip">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="surface-card p-4">
        <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Project' : 'New Project'}</h2>
        <div className="grid grid-cols-1 gap-4">
          <label className="grid gap-1">
            <span className="text-xs uppercase text-text-muted tracking-wide">Slug</span>
            <input
              className="input"
              value={draft.slug}
              onChange={e => setDraft({ ...draft, slug: e.target.value })}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs uppercase text-text-muted tracking-wide">Title</span>
            <input
              className="input"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs uppercase text-text-muted tracking-wide">Description</span>
            <textarea
              className="input min-h-24"
              value={draft.description ?? ''}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs uppercase text-text-muted tracking-wide">Repo URL</span>
            <input
              className="input"
              value={draft.repo_url ?? ''}
              onChange={e => setDraft({ ...draft, repo_url: e.target.value })}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs uppercase text-text-muted tracking-wide">Live URL</span>
            <input
              className="input"
              value={draft.live_url ?? ''}
              onChange={e => setDraft({ ...draft, live_url: e.target.value })}
            />
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="chip">
              Save
            </button>
            <button
              onClick={() => {
                setEditingIndex(null)
                setDraft(emptyProject)
              }}
              className="chip"
            >
              Cancel
            </button>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-4">Uses live API via Vite proxy.</p>
      </div>
    </div>
  )
}

export default AdminProjects
