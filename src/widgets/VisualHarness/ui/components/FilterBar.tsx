import type { FsdLayer } from '@/shared/lib/story-discovery'
import './FilterBar.css'

interface FilterBarProps {
  filter: FsdLayer | 'all'
  onFilterChange: (filter: FsdLayer | 'all') => void
  search: string
  onSearchChange: (search: string) => void
  layers: Array<FsdLayer | 'all'>
}

export function FilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  layers,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="layer-tabs">
        {layers.map((layer) => (
          <button
            key={layer}
            className={`layer-tab ${filter === layer ? 'active' : ''}`}
            onClick={() => onFilterChange(layer)}
          >
            {layer === 'all'
              ? 'All'
              : layer.charAt(0).toUpperCase() + layer.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Search components..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
