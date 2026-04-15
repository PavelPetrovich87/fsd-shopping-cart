import { useState, useEffect } from 'react'
import {
  storiesToComponentCards,
  type StoryMetadata,
} from '@/shared/lib/story-metadata'
import { defaultConfig } from '@/shared/lib/visual-harness-config'
import type { FsdLayer } from '@/shared/lib/story-discovery'
import { ComponentGrid } from './components/ComponentGrid'
import { FilterBar } from './components/FilterBar'
import './VisualHarness.css'

export function VisualHarness() {
  const [components, setComponents] = useState<StoryMetadata[]>([])
  const [filter, setFilter] = useState<FsdLayer | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComponents()
  }, [])

  async function loadComponents() {
    const loadStart = performance.now()
    try {
      setLoading(true)
      const cards = await storiesToComponentCards()
      const loadTime = performance.now() - loadStart

      if (loadTime > 2000) {
        console.warn(
          `Gallery load took ${loadTime.toFixed(0)}ms, exceeding 2s threshold`,
        )
      }

      try {
        const response = await fetch(`${defaultConfig.storybookUrl}/`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(2000),
        })
        if (!response.ok) {
          throw new Error('StorybookUnreachable')
        }
      } catch {
        setError(
          `Storybook is not reachable at ${defaultConfig.storybookUrl}. Please start Storybook with \`npm run storybook\` and ensure it is accessible.`,
        )
        setLoading(false)
        return
      }

      setComponents(cards)
      setError(null)
    } catch {
      setError('Failed to load components. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = components.filter((card) => {
    const matchesLayer = filter === 'all' || card.layer === filter
    const matchesSearch =
      search === '' || card.name.toLowerCase().includes(search.toLowerCase())
    return matchesLayer && matchesSearch
  })

  return (
    <div className="visual-harness">
      <header className="harness-header">
        <div className="header-content">
          <h1>UI Component Gallery</h1>
          <p>Visual harness for {components.length} components</p>
        </div>
      </header>

      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        layers={['all', 'shared', 'entities', 'features', 'widgets']}
      />

      <main className="harness-main">
        {loading && (
          <div className="state-message loading">Loading components...</div>
        )}
        {error && <div className="state-message error">{error}</div>}
        {!loading && !error && (
          <ComponentGrid
            components={filtered}
            storybookUrl={defaultConfig.storybookUrl}
          />
        )}
      </main>
    </div>
  )
}
