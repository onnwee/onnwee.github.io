import type { ComponentPropsWithoutRef } from 'react'
import { Callout, GlitchBox, Note } from './mdx'

const MdxComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="mb-6 text-4xl font-semibold" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="mb-5 text-3xl font-semibold" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="mb-4 text-2xl font-semibold text-text" {...props} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="mb-5 text-base leading-relaxed text-text-muted/90" {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="text-accent underline decoration-dotted underline-offset-4 hover:text-highlight"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded-md bg-surface-strong px-2 py-1 text-[13px] text-accent" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="surface-card overflow-x-auto rounded-2xl border border-border/40 p-5 text-sm shadow-soft"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="mb-5 list-disc pl-6 text-text-muted" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="mb-5 list-decimal pl-6 text-text-muted" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="mb-2" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-6 rounded-2xl border border-accent/25 bg-accent/5 px-6 py-4 text-base italic text-text"
      {...props}
    />
  ),
  Note,
  GlitchBox,
  Callout,
}

export default MdxComponents
