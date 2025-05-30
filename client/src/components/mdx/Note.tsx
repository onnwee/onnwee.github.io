import React from 'react'

const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 my-4 border-l-4 border-accent bg-neutral rounded text-sm">
      <strong className="block mb-1 text-accent">Note</strong>
      {children}
    </div>
  )
}

export default Note