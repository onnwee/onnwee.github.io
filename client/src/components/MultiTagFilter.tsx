type MultiTagFilterProps = {
  tags: string[]
  selected: string[]
  // eslint-disable-next-line no-unused-vars
  onToggle: (tag: string) => void
  onClear: () => void
}

const MultiTagFilter = ({ tags, selected, onToggle, onClear }: MultiTagFilterProps) => {
  const hasSelected = selected.length > 0

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onClear}
        className={`chip ${!hasSelected ? 'is-active' : ''}`}
        aria-pressed={!hasSelected}
        aria-label="Show all projects"
      >
        All projects
      </button>
      {tags.map(tag => {
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`chip ${isSelected ? 'is-active' : ''}`}
            aria-pressed={isSelected}
            aria-label={`Filter by ${tag}`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}

export default MultiTagFilter
