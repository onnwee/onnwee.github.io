// Glob import all MDX files and grab frontmatter only
const modules = import.meta.glob('../blog/*.mdx', { eager: true }) as Record<
  string,
  { frontmatter: any }
>

export const blogIndex = Object.entries(modules).map(([path, mod]) => {
  const slug = path.split('/').pop()?.replace('.mdx', '') || ''
  return {
    slug,
    ...mod.frontmatter,
  }
})
