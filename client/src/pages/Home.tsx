const Home = () => {
  return (
    <main id="main" className="section fade-in">
      <h1 className="heading">/home</h1>
      <p className="subheading">Welcome to the glitch.</p>

      <div className="terminal-box space-y-4">
        <p>
          I'm <span className="text-glitchGreen">onnwee</span> — a developer, musician, and
          political thinker building tools that promote open source, creative autonomy, and
          community solidarity.
        </p>

        <p>
          This is my lab: a space for experiments in code, aesthetics, and ideology. You'll find:
        </p>

        <ul className="list-disc list-inside text-sm">
          <li>🛠 Dev logs, open source projects, and experiments</li>
          <li>📼 Glitch-themed Twitch tools and overlays</li>
          <li>📣 Political education + media automation</li>
        </ul>

        <p>
          Check the{' '}
          <a href="/projects" className="link-hover text-accent">
            Projects
          </a>
          , read the{' '}
          <a href="/blog" className="link-hover text-accent">
            Blog
          </a>
          , or see how to{' '}
          <a href="/support" className="link-hover text-accent">
            Support
          </a>{' '}
          the work.
        </p>
      </div>
    </main>
  )
}

export default Home
