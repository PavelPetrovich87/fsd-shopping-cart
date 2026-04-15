import fs from 'fs'
import path from 'path'

export type FsdLayer = 'shared' | 'entities' | 'features' | 'widgets' | 'pages'

export interface DiscoveredStory {
  filePath: string
  componentName: string
  layer: FsdLayer
}

function getLayerFromPath(filePath: string): FsdLayer {
  const relativePath = path.relative(process.cwd(), filePath)
  const match = relativePath.match(
    /^src\/(shared|entities|features|widgets|pages)/,
  )
  return (match?.[1] as FsdLayer) ?? 'shared'
}

function getComponentNameFromPath(filePath: string): string {
  const basename = path.basename(filePath, '.stories.tsx')
  return basename.charAt(0).toUpperCase() + basename.slice(1)
}

export async function discoverStories(): Promise<DiscoveredStory[]> {
  const searchDir = path.join(process.cwd(), 'src')

  const stories: DiscoveredStory[] = []

  function scanDir(dir: string): void {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.stories.tsx')) {
        const layer = getLayerFromPath(fullPath)
        if (layer === 'pages') continue

        stories.push({
          filePath: fullPath,
          componentName: getComponentNameFromPath(fullPath),
          layer,
        })
      }
    }
  }

  scanDir(searchDir)

  return stories
}
