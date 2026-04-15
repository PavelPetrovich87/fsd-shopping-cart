import { test, type Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import {
  defaultConfig,
  type Viewport,
} from '@/shared/lib/visual-harness-config'
import { storiesToComponentCards } from '@/shared/lib/story-metadata'

interface TestResult {
  componentId: string
  viewport: string
  passed: boolean
  diffRatio: number
  baselinePath: string
  diffPath?: string
  isNewBaseline: boolean
}

const isUpdateMode = process.env.UPDATE_BASELINES === 'true'

function getDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function getBaselinePath(
  componentId: string,
  viewport: Viewport,
  date: string,
): string {
  return path.join(
    defaultConfig.baselineDir,
    componentId,
    viewport.name,
    `${date}.png`,
  )
}

function getDiffPath(
  componentId: string,
  viewport: Viewport,
  date: string,
): string {
  return path.join(
    defaultConfig.diffDir,
    componentId,
    viewport.name,
    `${date}.png`,
  )
}

async function ensureDir(filePath: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
}

async function captureStoryScreenshot(
  page: Page,
  storyPath: string,
  viewport: Viewport,
): Promise<Buffer> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })

  const storyUrl = `${defaultConfig.storybookUrl}/?path=/story/${storyPath}`
  await page.goto(storyUrl)

  await page
    .waitForSelector('#storybook-root', { timeout: 10000 })
    .catch(() => {
      return page.waitForSelector('.sb-show-main', { timeout: 5000 })
    })

  await page.waitForTimeout(500)

  return await page.screenshot({
    type: 'png',
    fullPage: false,
  })
}

async function compareScreenshots(
  baseline: Buffer,
  actual: Buffer,
  width: number,
  height: number,
): Promise<{ passed: boolean; diffRatio: number; diffBuffer?: Buffer }> {
  const baselineImg = PNG.sync.read(baseline)
  const actualImg = PNG.sync.read(actual)

  const diff = new PNG(width, height)
  const diffPixelCount = pixelmatch(
    baselineImg.data,
    actualImg.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  )

  const diffRatio = diffPixelCount / (width * height)
  const passed = diffRatio <= defaultConfig.diffThreshold

  return {
    passed,
    diffRatio,
    diffBuffer: passed ? undefined : PNG.sync.write(diff),
  }
}

function generateReport(results: TestResult[]): string {
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const newBaselines = results.filter((r) => r.isNewBaseline).length

  const failures = results.filter((r) => !r.passed)
  const newBaselineList = results.filter((r) => r.isNewBaseline)

  let report = `# Visual Regression Report
Generated: ${new Date().toISOString()}

## Summary
- Total: ${results.length}
- Passed: ${passed}
- Failed: ${failed}
- New Baselines: ${newBaselines}

`

  if (failures.length > 0) {
    report += `## Failures\n`
    for (const f of failures) {
      report += `- ${f.componentId} @ ${f.viewport}: ${(f.diffRatio * 100).toFixed(2)}% diff\n`
      report += `  Baseline: ${f.baselinePath}\n`
      report += `  Diff: ${f.diffPath || 'N/A'}\n\n`
    }
  }

  if (newBaselineList.length > 0) {
    report += `## New Baselines Needed\n`
    for (const nb of newBaselineList) {
      report += `- ${nb.componentId} @ ${nb.viewport}\n`
    }
  }

  return report
}

test.describe('Visual Regression', () => {
  let componentCards: Awaited<ReturnType<typeof storiesToComponentCards>>
  const testResults: TestResult[] = []
  const dateString = getDateString()

  test.beforeAll(async () => {
    componentCards = await storiesToComponentCards()
  })

  test.afterAll(async () => {
    const report = generateReport(testResults)
    const reportPath = path.join(defaultConfig.diffDir, 'report.md')
    await ensureDir(reportPath)
    await fs.promises.writeFile(reportPath, report)
    console.log('\n' + report)
  })

  for (const component of componentCards) {
    for (const viewport of defaultConfig.viewportConfig) {
      const testName = `${component.componentId}-${viewport.name}`

      test(testName, async ({ page }) => {
        const baselinePath = getBaselinePath(
          component.componentId,
          viewport,
          dateString,
        )
        const diffPath = getDiffPath(
          component.componentId,
          viewport,
          dateString,
        )
        const baselineExists = fs.existsSync(baselinePath)

        if (isUpdateMode || !baselineExists) {
          const screenshot = await captureStoryScreenshot(
            page,
            component.storyPath,
            viewport,
          )
          await ensureDir(baselinePath)
          await fs.promises.writeFile(baselinePath, screenshot)

          testResults.push({
            componentId: component.componentId,
            viewport: viewport.name,
            passed: true,
            diffRatio: 0,
            baselinePath,
            isNewBaseline: !baselineExists,
          })

          if (!baselineExists) {
            console.log(`Created new baseline: ${baselinePath}`)
          }
          return
        }

        const screenshot = await captureStoryScreenshot(
          page,
          component.storyPath,
          viewport,
        )
        const baselineBuffer = await fs.promises.readFile(baselinePath)

        const result = await compareScreenshots(
          baselineBuffer,
          screenshot,
          viewport.width,
          viewport.height,
        )

        if (!result.passed && result.diffBuffer) {
          await ensureDir(diffPath)
          await fs.promises.writeFile(diffPath, result.diffBuffer)

          testResults.push({
            componentId: component.componentId,
            viewport: viewport.name,
            passed: false,
            diffRatio: result.diffRatio,
            baselinePath,
            diffPath,
            isNewBaseline: false,
          })

          if (defaultConfig.failOnDiff) {
            throw new Error(
              `Visual regression detected for ${component.componentId}@${viewport.name}. ` +
                `Diff ratio: ${(result.diffRatio * 100).toFixed(2)}%`,
            )
          }
        } else {
          testResults.push({
            componentId: component.componentId,
            viewport: viewport.name,
            passed: true,
            diffRatio: result.diffRatio,
            baselinePath,
            isNewBaseline: false,
          })
        }
      })
    }
  }
})
