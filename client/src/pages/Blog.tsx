import BlogIndex from '@/components/BlogIndex'

const Blog = () => {
  return (
    <main id="main" className="section space-y-12">
      <header className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="chip is-active w-fit">Blog</p>
            <h1 className="headline">Notes from the build log.</h1>
            <p className="subhead max-w-2xl">
              Architecture deep-dives, post-mortems, and creative experiments written for fellow
              engineers and technologists. Expect pragmatic insights with a little extra style.
            </p>
          </div>
          <div className="rounded-3xl border border-border/40 bg-surface-elevated/70 px-6 py-5 text-xs uppercase tracking-[0.35em] text-text-muted shadow-soft">
            Updated regularly • Technical writing • Process transparency
          </div>
        </div>
      </header>

      <BlogIndex />
    </main>
  )
}

export default Blog
