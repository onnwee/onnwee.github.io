## 📝 TODO List

### ✅ Core Setup
- [x] Vite + React + TypeScript configured
- [x] Tailwind CSS with Dracula-inspired theme
- [x] Google Fonts with fallback for hacker + Evangelion aesthetic
- [x] Routing using `react-router-dom`
- [x] Alias `@` set to `src/`

### 🧠 Site Layout
- [x] `Layout.tsx` with `Outlet`
- [x] Sticky header with glitch logo and toggles
- [x] Nav with React Router
- [x] Footer with slogan / license

### 🧬 Glitch Mode Support
- [x] `ThemeContext` with `glitchMode` and `darkMode`
- [x] Utility classes: `.glitch-box`, `.clean-box`, `.glitch-tag`
- [x] Apply to:
  - [x] TerminalCard
  - [x] Project images
  - [x] Embeds
  - [x] Tags (optional)
- [x] Animated glitch keyframes
- [x] Global theme toggle buttons

### 🖥 TerminalCard
- [x] Base card with title, tags, and footer
- [x] Hover interaction and scaling
- [x] ProjectCard support with color variants
- [x] Link wrapping (internal/external)

### 🗂 Project System
- [x] `projects.ts` data file
- [x] Dynamic route for `/projects/:slug`
- [x] `ProjectDetail.tsx` with tag display
- [x] Image + embed preview blocks
- [x] Auto-render embed platforms
- [x] Fallback cards with emoji + blur

### 📦 Embeds
- [x] `renderEmbed()` with logic for:
  - [x] YouTube
  - [x] Spotify
  - [x] SoundCloud
  - [x] Bandcamp
  - [x] Twitch (via `channel`)
  - [x] Twitter (fallback)
  - [x] TikTok (fallback)
  - [x] Bluesky (fallback)
  - [x] Instagram (fallback)
- [x] `<EmbedWrapper>` with loading animation + blur
- [x] Grayscale on load, full color on render

### 📃 Blog (Planned)
- [ ] Add MDX support via `vite-plugin-mdx`
- [ ] Create MDX-enhanced components (`<Callout />`, `<Footnote />`, etc.)
- [ ] RSS feed for blog posts (optional)
- [ ] Filterable/tagged blog page

### 🧱 Visual Polish
- [x] Logo as SVG (hand-drawn-style face + text)
- [ ] `<GlitchWrapper>` component (optional HOC or div)
- [ ] Glitchy hover states on links/buttons
- [ ] Background noise or animation (subtle)

### 🚀 Deployment
- [x] Deploy to `onnwee.github.io` via GitHub Actions
- [ ] Set up custom domain (optional)
- [ ] Add Umami analytics script (self-hosted or SaaS)
