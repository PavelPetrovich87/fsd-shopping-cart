import fs from 'fs'
import { DiscoveredStory, discoverStories } from './story-discovery'
import type { FsdLayer } from './story-discovery'

export interface StoryMetadata {
  componentId: string
  name: string
  layer: FsdLayer
  storyCount: number
  variants: string[]
  lastUpdated: string
  storyPath: string
}

function parseTitleFromContent(content: string): string | null {
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/)
  return titleMatch?.[1] ?? null
}

function parseStoryExports(content: string): string[] {
  const storyMatches = content.matchAll(
    /export\s+(const|static)\s+(\w+):\s*Story/g,
  )
  return Array.from(storyMatches, (match) => match[2])
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function parseStoryMetadata(story: DiscoveredStory): StoryMetadata {
  const content = fs.readFileSync(story.filePath, 'utf-8')
  const stats = fs.statSync(story.filePath)

  const title = parseTitleFromContent(content)
  const variants = parseStoryExports(content)

  const componentName = title?.split('/').pop() ?? story.componentName

  return {
    componentId: kebabCase(componentName),
    name: componentName,
    layer: story.layer,
    storyCount: variants.length,
    variants,
    lastUpdated: stats.mtime.toISOString(),
    storyPath: title ?? story.componentName,
  }
}

export async function storiesToComponentCards(): Promise<StoryMetadata[]> {
  const stories = await discoverStories()
  return stories.map(parseStoryMetadata)
}
