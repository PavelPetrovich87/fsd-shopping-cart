import { useState } from 'react'
import type { StoryMetadata } from '@/shared/lib/story-metadata'
import './ComponentCard.css'

interface ComponentCardProps {
  component: StoryMetadata
  storybookUrl: string
}

export function ComponentCard({ component, storybookUrl }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const storybookStoryUrl = `${storybookUrl}/?path=/story/${component.storyPath}`

  return (
    <div className={`component-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header">
        <span className={`layer-badge layer-${component.layer}`}>
          {component.layer}
        </span>
        <span className="variant-count">{component.storyCount} variants</span>
      </div>

      <div className="card-preview" onClick={() => setExpanded(!expanded)}>
        <div className="preview-placeholder">
          <span className="preview-icon">◻</span>
          <span className="preview-text">{component.name}</span>
        </div>

        {expanded && (
          <div className="expanded-preview">
            <iframe
              src={storybookStoryUrl}
              title={`${component.name} preview`}
              className="preview-iframe"
            />
            <button
              className="close-preview"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(false)
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="card-footer">
        <h3 className="component-name">{component.name}</h3>
        <div className="variants">
          {component.variants.slice(0, 3).map((variant) => (
            <span key={variant} className="variant-tag">
              {variant}
            </span>
          ))}
          {component.variants.length > 3 && (
            <span className="more-variants">
              +{component.variants.length - 3}
            </span>
          )}
        </div>
        <a
          href={storybookStoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="storybook-link"
          onClick={(e) => e.stopPropagation()}
        >
          Open in Storybook →
        </a>
      </div>
    </div>
  )
}
