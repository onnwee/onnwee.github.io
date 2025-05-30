import type { MDXComponents } from 'mdx/types'
import { Note, Callout, GlitchBox } from './mdx'

const MdxComponents: MDXComponents = {
  h1: props => <h1 className="text-3xl font-display mb-4" {...props} />,
  h2: props => <h2 className="text-2xl font-display mb-3" {...props} />,
  p: props => <p className="mb-4 text-sm leading-relaxed" {...props} />,
  a: props => <a className="link-hover text-accent" {...props} />,
  code: props => <code className="text-accent bg-neutral px-1 rounded" {...props} />,
  pre: props => <pre className="bg-neutral p-4 rounded text-sm overflow-x-auto" {...props} />,
  Note,
  GlitchBox,
  Callout,
}

export default MdxComponents
