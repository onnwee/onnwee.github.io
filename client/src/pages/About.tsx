const About = () => {
  return (
    <main id="main" className="section fade-up">
      <h1 className="heading">/about</h1>
      <p className="subheading">Who is onnwee?</p>

      <div className="terminal-box space-y-4">
        <p>
          I'm a full-stack developer and musician building glitchy tools and systems that resist
          commodification.
        </p>

        <p>
          I believe in <span className="text-glitchRed">accessible tech</span>,{' '}
          <span className="text-glitchGreen">open source ideology</span>, and{' '}
          <span className="text-glitchBlue">creative resistance</span>.
        </p>

        <p>
          My work blends dev culture, D.I.Y. music ethos, and a leftist critique of tech. I build in
          public and aim to empower others to do the same.
        </p>

        <p className="text-xs opacity-60">Reach out via GitHub, Discord, or twitch.tv/onnwee.</p>
      </div>
    </main>
  )
}

export default About
