const Support = () => {
  return (
    <div className="section">
      <h1 className="heading">/support</h1>
      <p className="subheading">Ways to support my work & how I give back.</p>

      <div className="terminal-box">
        <p>
          This project is open source and driven by community energy. If you'd like to support it:
        </p>

        <ul className="list-disc list-inside text-sm mt-4">
          <li>🧪 Star the repo on GitHub</li>
          <li>
            💸 Contribute on{' '}
            <a
              className="link-hover text-accent"
              href="https://patreon.com/onnwee"
              target="_blank"
              rel="noopener noreferrer"
            >
              Patreon
            </a>
          </li>
          <li>📣 Share it with other devs, artists, and leftists</li>
        </ul>

        <p className="mt-6 text-sm opacity-60">
          You can also open a PR, file an issue, or suggest a feature.
        </p>
      </div>
    </div>
  )
}

export default Support
