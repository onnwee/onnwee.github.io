type TagFilterProps = {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

const TagFilter = ({ tags, selected, onSelect }: TagFilterProps) => (
  <div className="flex flex-wrap gap-2 mb-6">
    <button
      onClick={() => onSelect(null)}
      className={`tag ${!selected ? 'bg-accent text-black' : 'bg-neutral'}`}
    >
      All
    </button>
    {tags.map(tag => (
      <button
        key={tag}
        onClick={() => onSelect(tag)}
        className={`tag ${selected === tag ? 'bg-accent text-black' : 'bg-neutral'}`}
      >
        #{tag}
      </button>
    ))}
  </div>
)
export default TagFilter
