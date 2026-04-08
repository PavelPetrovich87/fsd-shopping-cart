#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

const ARCHITECTURE_PATH = path.join(process.cwd(), 'ARCHITECTURE.md')
const TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.app.json')
const SRC_DIR = path.join(process.cwd(), 'src')

interface Edge {
  source: string
  target: string
}

function readTsconfigPaths(): Record<string, string[]> {
  const content = fs.readFileSync(TSCONFIG_PATH, 'utf-8')
  const stripped = content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  const config = JSON.parse(stripped)
  return config.compilerOptions.paths || {}
}

function resolveAlias(
  specifier: string,
  paths: Record<string, string[]>,
): string | null {
  for (const [alias] of Object.entries(paths)) {
    const aliasPattern = alias.replace('/*', '')
    if (specifier.startsWith(aliasPattern)) {
      const suffix = specifier.slice(aliasPattern.length).replace(/^\/+/, '')
      return suffix
    }
  }
  return null
}

function getSliceFromPath(filePath: string): string {
  const relative = path.relative(SRC_DIR, filePath)
  const parts = relative.split(path.sep)

  if (parts[0] === 'shared') {
    const segment = parts[1] || 'shared'
    return segment === 'shared' ? 'shared' : `shared/${segment}`
  }

  const slice = parts[1] || parts[0]
  return slice
}

function parseArchitectureGraph(content: string): Edge[] {
  const lines = content.split('\n')
  const edges: Edge[] = []
  let inSliceLevelGraph = false
  let inSubgraph = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.includes('### Slice-Level Graph')) {
      inSliceLevelGraph = true
      continue
    }

    if (!inSliceLevelGraph) continue

    if (trimmed === '```mermaid') {
      if (inSubgraph) {
        inSubgraph = false
      } else if (edges.length > 0 || trimmed.includes('graph')) {
        continue
      }
      continue
    }

    if (trimmed === '```') {
      if (edges.length > 0) break
      continue
    }

    if (trimmed.startsWith('subgraph')) {
      inSubgraph = true
      continue
    }

    if (trimmed === 'end') {
      inSubgraph = false
      continue
    }

    if (inSubgraph) continue

    const edgeMatch = trimmed.match(/^(\w+(?:\/\w+)?)\s*-->\s*(\w+(?:\/\w+)?)$/)
    if (edgeMatch) {
      edges.push({
        source: edgeMatch[1],
        target: edgeMatch[2],
      })
    }
  }

  return edges
}

function extractImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  )

  const imports: string[] = []

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier.getText()
      const cleaned = moduleSpecifier.replace(/['"]/g, '').trim()
      if (cleaned && !cleaned.startsWith('.')) {
        imports.push(cleaned)
      }
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const moduleSpecifier = node.moduleSpecifier.getText()
      const cleaned = moduleSpecifier.replace(/['"]/g, '').trim()
      if (cleaned && !cleaned.startsWith('.')) {
        imports.push(cleaned)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return imports
}

function shouldExclude(filePath: string): boolean {
  const excluded = [
    /\.stories\.(ts|tsx)$/,
    /\.test\.(ts|tsx)$/,
    /\.spec\.(ts|tsx)$/,
    /\.d\.ts$/,
  ]
  return excluded.some((pattern) => pattern.test(filePath))
}

function scanSourceFiles(dir: string): string[] {
  const files: string[] = []

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue
        walk(fullPath)
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        if (!shouldExclude(fullPath)) {
          files.push(fullPath)
        }
      }
    }
  }

  walk(dir)
  return files
}

function isSliceEmpty(srcDir: string, sliceName: string): boolean {
  const featuresDir = path.join(srcDir, 'features', sliceName)
  const entitiesDir = path.join(srcDir, 'entities', sliceName)
  const actualDir = fs.existsSync(featuresDir) ? featuresDir : entitiesDir

  if (!fs.existsSync(actualDir)) return true

  const indexPath = path.join(actualDir, 'index.ts')
  if (!fs.existsSync(indexPath)) return true

  const content = fs.readFileSync(indexPath, 'utf-8').trim()
  return content === '' || content === 'export {}' || content === 'export {};'
}

function buildActualGraph(
  srcDir: string,
  paths: Record<string, string[]>,
): { edges: Edge[]; emptySlices: Set<string> } {
  const edges = new Set<string>()
  const emptySlices = new Set<string>()
  const files = scanSourceFiles(srcDir)

  for (const filePath of files) {
    const sourceSlice = getSliceFromPath(filePath)
    const imports = extractImports(filePath)

    for (const specifier of imports) {
      const resolved = resolveAlias(specifier, paths)

      if (!resolved) continue

      if (resolved.startsWith('shared/')) {
        const parts = resolved.split('/')
        const targetSegment = `shared/${parts[1]}`
        if (
          sourceSlice !== targetSegment &&
          !sourceSlice.startsWith('shared/')
        ) {
          edges.add(`${sourceSlice} --> ${targetSegment}`)
        }
      } else if (resolved.startsWith('entities/')) {
        const targetSlice = resolved.replace('entities/', '')
        if (sourceSlice !== targetSlice) {
          edges.add(`${sourceSlice} --> ${targetSlice}`)
        }
      } else if (resolved.startsWith('features/')) {
        const targetSlice = resolved.replace('features/', '')
        if (sourceSlice !== targetSlice) {
          edges.add(`${sourceSlice} --> ${targetSlice}`)
        }
      }
    }
  }

  for (const slice of ['shopping-cart', 'product']) {
    if (isSliceEmpty(srcDir, slice)) {
      emptySlices.add(slice)
    }
  }

  return {
    edges: Array.from(edges).map((edge) => {
      const [source, target] = edge.split(' --> ')
      return { source, target }
    }),
    emptySlices,
  }
}

function edgesToSet(edges: Edge[]): Set<string> {
  return new Set(edges.map((e) => `${e.source} --> ${e.target}`))
}

function main() {
  const architectureContent = fs.readFileSync(ARCHITECTURE_PATH, 'utf-8')
  const paths = readTsconfigPaths()

  const intendedEdges = parseArchitectureGraph(architectureContent)
  const { edges: actualEdges, emptySlices } = buildActualGraph(SRC_DIR, paths)

  const intendedSet = edgesToSet(intendedEdges)
  const actualSet = edgesToSet(actualEdges)

  const undocumented: string[] = []
  const stale: string[] = []

  for (const edge of actualSet) {
    if (!intendedSet.has(edge)) {
      undocumented.push(edge)
    }
  }

  for (const edge of intendedSet) {
    if (!actualSet.has(edge)) {
      const [source] = edge.split(' --> ')
      if (!emptySlices.has(source)) {
        stale.push(edge)
      }
    }
  }

  if (undocumented.length === 0 && stale.length === 0) {
    console.log(
      `✅ Architecture graph matches imports (${actualEdges.length} edges verified)`,
    )
    process.exit(0)
  }

  console.log('❌ Architecture graph mismatch:\n')

  if (undocumented.length > 0) {
    console.log(
      'UNDOCUMENTED DEPENDENCIES (import exists, missing from ARCHITECTURE.md):',
    )
    for (const edge of undocumented.sort()) {
      console.log(`  ${edge}`)
    }
    console.log('')
  }

  if (stale.length > 0) {
    console.log('STALE DOCUMENTATION (in ARCHITECTURE.md, no import found):')
    for (const edge of stale.sort()) {
      console.log(`  ${edge}`)
    }
    console.log('')
  }

  console.log(
    'Run: update ARCHITECTURE.md to match actual imports, or fix the imports.',
  )
  process.exit(1)
}

main()
