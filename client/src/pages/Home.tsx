const Home = () => {
  return (
    <main id="main" className="section space-y-24">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="chip is-active w-fit">Full-Stack Developer</p>
          <h1 className="headline">
            Shipping beautiful <span className="gradient-text">experiences</span> with robust
            systems underneath.
          </h1>
          <p className="subhead max-w-xl">
            I design, build, and scale end-to-end products—pairing polished interfaces with
            battle-tested infrastructure. From React and TypeScript to Go and observability stacks,
            I bring a product-minded engineering approach to every engagement.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="/projects"
              className="inline-flex items-center gap-3 rounded-full bg-accent-gradient px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-crust shadow-pop transition hover:shadow-glow"
            >
              View Projects
            </a>
            <a
              href="/support"
              className="inline-flex items-center gap-3 rounded-full border border-border/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-text transition hover:border-accent/60 hover:text-accent"
            >
              Collaborate
            </a>
          </div>

          <dl className="grid max-w-lg grid-cols-2 gap-6 pt-8 text-xs uppercase tracking-[0.35em] text-text-muted">
            <div>
              <dt>Specialities</dt>
              <dd className="mt-2 text-sm normal-case tracking-normal text-text">
                Design systems, API architecture, observability
              </dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd className="mt-2 text-sm normal-case tracking-normal text-text">
                Building tools for creators & community media
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative isolate overflow-hidden rounded-[32px] border border-border/30 bg-surface/80 p-10 shadow-soft">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 bg-glow/20 blur-[120px]" />

          <div className="relative space-y-6">
            <h2 className="text-sm uppercase tracking-[0.4em] text-text-muted">Toolkit</h2>
            <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-text">
              {[
                'React • TypeScript',
                'Go • sqlc • Postgres',
                'Vercel • Fly.io',
                'Prometheus • Grafana',
                'Tailwind • Design Systems',
                'CI/CD • GitHub Actions',
              ].map(item => (
                <li
                  key={item}
                  className="rounded-2xl border border-border/40 bg-surface-elevated/80 px-4 py-3 text-[13px] tracking-wide shadow-soft/30"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-70" />
        <div className="relative grid gap-8 md:grid-cols-3">
          <article className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.38em] text-text-muted">
              Product Thinking
            </h3>
            <p className="text-base text-text-muted/95">
              I back every build with research, rapid prototyping, and stakeholder feedback loops.
              Expect crisp pitch decks, clickable demos, and metrics your team can act on.
            </p>
          </article>
          <article className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.38em] text-text-muted">
              Engineering Rigor
            </h3>
            <p className="text-base text-text-muted/95">
              Clean architecture, resilient APIs, and security-first workflows. From monorepos to
              distributed services, I keep complexity manageable and observable.
            </p>
          </article>
          <article className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.38em] text-text-muted">Creative polish</h3>
            <p className="text-base text-text-muted/95">
              Motion design, typography, and micro-interactions that feel deliberate. A Catppuccin
              inspired system ties the entire experience together.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Home
