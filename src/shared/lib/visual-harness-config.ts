export interface Viewport {
  name: 'desktop' | 'mobile' | 'tablet'
  width: number
  height: number
}

export interface HarnessConfig {
  storiesPattern: string
  storybookUrl: string
  viewportConfig: Viewport[]
  baselineDir: string
  diffDir: string
  failOnDiff: boolean
  diffThreshold: number
}

export const defaultConfig: HarnessConfig = {
  storiesPattern: 'src/**/*.stories.tsx',
  storybookUrl: 'http://localhost:6006',
  viewportConfig: [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
  ],
  baselineDir: 'visual-baselines',
  diffDir: 'visual-diffs',
  failOnDiff: true,
  diffThreshold: 0.001,
}
