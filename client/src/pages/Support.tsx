import type { MouseEvent } from 'react'

const supportMeta = [
  {
    icon: '⭐',
    title: 'Star the repo',
    copy: 'Show the project some love on GitHub so it continues to surface for curious builders.',
    action: {
      label: 'Open repository',
      href: 'https://github.com/onnwee/onnwee.github.io',
    },
  },
  {
    icon: '💸',
    title: 'Fuel development',
    copy: 'Recurring support covers hosting, design assets, and time spent writing deep dives.',
    action: {
      label: 'Support on Patreon',
      href: 'https://patreon.com/onnwee',
    },
  },
  {
    icon: '📣',
    title: 'Share the work',
    copy: 'Send the site to folks who vibe with humane tech, leftist tooling, or glitchy aesthetics.',
    action: {
      label: 'Copy site URL',
      href: 'https://onnwee.dev',
    },
  },
]

const giveBackMeta = [
  {
    title: 'Open source first',
    description:
      'Every component, hook, and backend primitive lands in the repo with permissive licensing. Pull requests are actively reviewed and merged.',
  },
  {
    title: 'Education & docs',
    description:
      'Long-form breakdowns, livestream builds, and architecture notes help others remix the stack or slot it into their own practice.',
  },
  {
    title: 'Mutual aid',
    description:
      'A slice of recurring support goes to community bail funds and climate resilience orgs. Receipts get posted quarterly.',
  },
]

const Support = () => {
  const handleCopy = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText('https://onnwee.dev')
    } catch (error) {
      console.error('Failed to copy URL', error)
    }
  }

  return (
    <section className="section space-y-10">
      <header className="surface-card relative overflow-hidden px-8 py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 12% 20%, rgba(var(--color-accent), 0.28), transparent 55%), radial-gradient(circle at 80% 10%, rgba(var(--color-highlight), 0.24), transparent 60%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex max-w-3xl flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.32em] text-text-muted">/support</span>
          <h1 className="text-4xl font-semibold text-text">Keep the experiments humming</h1>
          <p className="text-base leading-relaxed text-text-muted/90">
            This site runs on open source energy, late-night design sprints, and a love for generous
            tooling. If it helped you ship, learn, or dream a little bigger, here are direct ways to
            sustain it.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/onnwee/onnwee.github.io"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface/70 px-5 py-2 text-sm font-medium text-text transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⭐ Star on GitHub
            </a>
            <a
              href="https://patreon.com/onnwee"
              className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-5 py-2 text-sm font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              💸 Join the Patreon
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {supportMeta.map(({ icon, title, copy, action }) => (
          <article key={title} className="surface-card flex h-full flex-col gap-5 px-6 py-7">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-text-muted">
              <span className="inline-flex h-1.5 w-8 rounded-full bg-accent/70" />
              Support channel
            </div>
            <h2 className="text-2xl font-semibold text-text">
              <span className="mr-2 text-2xl align-middle">{icon}</span>
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-text-muted/90">{copy}</p>
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={action.label === 'Copy site URL' ? handleCopy : undefined}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent transition-colors duration-300 hover:text-highlight"
            >
              {action.label}
              <span aria-hidden>→</span>
            </a>
          </article>
        ))}
      </section>

      <section className="surface-card px-8 py-10">
        <h2 className="text-3xl font-semibold text-text">How support flows back out</h2>
        <p className="mt-3 text-base text-text-muted/90">
          Transparency is part of the mission. Every contribution is an invitation to redistribute
          knowledge, access, and energy.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {giveBackMeta.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/30 bg-surface/70 p-6 shadow-soft"
            >
              <h3 className="text-lg font-semibold text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted/85">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="surface-card flex flex-col gap-4 px-6 py-7 text-sm leading-relaxed text-text-muted/90 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Community vibes</p>
          <p className="mt-2 text-base text-text">
            Want a custom walkthrough, pairing session, or to sponsor a specific feature? My inbox
            is open—let’s collaborate.
          </p>
        </div>
        <a
          href="mailto:hey@onnwee.dev?subject=Let%E2%80%99s%20collaborate"
          className="inline-flex items-center justify-center rounded-full bg-accent/15 px-5 py-2 text-sm font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
        >
          ✉️ Email hey@onnwee.dev
        </a>
      </aside>
    </section>
  )
}

export default Support
