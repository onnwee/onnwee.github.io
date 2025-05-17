import { ThemeToggle } from "@/components"
import { Routes, Route } from 'react-router-dom'
import { Nav } from "@/components"
import { Home, Projects, ProjectDetail, Blog, About, Support } from "@/pages"

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <ThemeToggle />
    </>
  )
}

export default App