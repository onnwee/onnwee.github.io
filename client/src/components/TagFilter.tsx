type TagFilterProps = {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

const TagFilter = ({ tags, selected, onSelect }: TagFilterProps) => (
  <div className="flex flex-wrap gap-3">
    <button onClick={() => onSelect(null)} className={`chip ${!selected ? 'is-active' : ''}`}>
      All posts
    </button>
    {tags.map(tag => (
      <button
        key={tag}
        onClick={() => onSelect(tag)}
        className={`chip ${selected === tag ? 'is-active' : ''}`}
      >
        #{tag}
      </button>
    ))}
  </div>
)
export default TagFilter
