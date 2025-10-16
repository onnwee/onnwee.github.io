const About = () => {
  return (
    <main id="main" className="section space-y-16">
      <header className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-6">
            <p className="chip is-active w-fit">About</p>
            <h1 className="headline">Hi, I’m onnwee.</h1>
            <p className="subhead max-w-2xl">
              Full-stack engineer, systems designer, and music producer. I thrive at the
              intersection of product thinking and creative technology—crafting experiences that
              feel as refined as they are resilient.
            </p>
          </div>
          <ul className="space-y-4 rounded-3xl border border-border/40 bg-surface-elevated/70 p-6 text-sm text-text-muted shadow-soft">
            {[
              'Based in the Pacific Northwest',
              'Pronouns: they/them',
              'Working remotely & available for select collaborations',
              'Alignment: community-driven technology & open ecosystems',
            ].map(fact => (
              <li key={fact} className="leading-relaxed">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="grid gap-10 md:grid-cols-2">
        <article className="surface-card p-8 space-y-5">
          <h2 className="text-lg font-semibold text-text">Philosophy</h2>
          <p className="text-base text-text-muted">
            I believe technology should expand access, not extract value. My work centers on
            platforms that empower artists, educators, and organizers—with a constant eye on
            sustainability, accessibility, and joy.
          </p>
          <p className="text-base text-text-muted">
            Good products are a dialogue between people and systems. I facilitate that conversation
            through collaborative workshops, design audits, and steady delivery.
          </p>
        </article>
        <article className="surface-card p-8 space-y-5">
          <h2 className="text-lg font-semibold text-text">Capabilities</h2>
          <ul className="grid gap-3 text-sm text-text">
            {[
              'Design systems + component libraries',
              'API architecture & technical strategy',
              'Analytics, observability & performance tuning',
              'Creative coding for live events & streaming',
              'Documentation, workshops, and team onboarding',
            ].map(item => (
              <li
                key={item}
                className="rounded-2xl border border-border/40 bg-surface/80 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="surface-card p-10">
        <h2 className="text-lg font-semibold text-text">Let’s collaborate</h2>
        <p className="mt-4 text-base text-text-muted">
          Whether you need a product sprint, infrastructure overhaul, or a long-term technical
          partner, I bring a holistic approach to ship value quickly—and beautifully. Reach out via
          <a className="ml-1 underline hover:text-accent" href="mailto:hey@onnwee.dev">
            hey@onnwee.dev
          </a>{' '}
          or message me on{' '}
          <a className="underline hover:text-accent" href="https://discord.gg/">
            Discord
          </a>{' '}
          to start the conversation.
        </p>
      </section>
    </main>
  )
}

export default About
