import type { StoryMetadata } from '@/shared/lib/story-metadata'
import { ComponentCard } from './ComponentCard'
import './ComponentGrid.css'

interface ComponentGridProps {
  components: StoryMetadata[]
  storybookUrl: string
}

export function ComponentGrid({
  components,
  storybookUrl,
}: ComponentGridProps) {
  if (components.length === 0) {
    return (
      <div className="empty-gallery">
        <div className="empty-icon">📦</div>
        <h2>No Components Found</h2>
        <p>
          This gallery displays Storybook stories from the <code>src/</code>{' '}
          directory.
        </p>
        <p>To add components:</p>
        <ol>
          <li>
            Create a Storybook story file (e.g.,{' '}
            <code>src/shared/ui/Button.stories.tsx</code>)
          </li>
          <li>
            Follow the CSF3 format with a <code>meta</code> export
          </li>
          <li>
            Add a <code>title</code> property to define the component name
          </li>
        </ol>
        <p>
          See <code>src/shared/ui/shadcn/button.stories.tsx</code> for an
          example.
        </p>
      </div>
    )
  }

  return (
    <div className="component-grid">
      {components.map((component) => (
        <ComponentCard
          key={component.componentId}
          component={component}
          storybookUrl={storybookUrl}
        />
      ))}
    </div>
  )
}
