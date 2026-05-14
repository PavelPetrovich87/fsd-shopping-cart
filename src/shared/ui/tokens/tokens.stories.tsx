import type { Meta, StoryObj } from '@storybook/react'
import {
  primitiveColors,
  semanticColors,
  fontSizes,
  fontWeights,
  fontFamily,
  spacing,
  radius,
  shadows,
} from './index'

const meta = {
  title: 'Design Tokens',
  parameters: {
    docs: {
      description: {
        component: 'Visual reference for all design tokens',
      },
    },
  },
} satisfies Meta<null>

export default meta
type Story = StoryObj<typeof meta>

export const PrimitiveColors: Story = {
  render: () => {
    const entries = Object.entries(primitiveColors) as [string, string][]
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, hsl]) => (
          <div
            key={name}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div
              style={{
                width: '100%',
                height: '4rem',
                borderRadius: '0.5rem',
                backgroundColor: hsl,
                border: '1px solid hsl(0 0% 90%)',
              }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {name}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: 'hsl(0 0% 45%)',
                fontFamily: 'monospace',
              }}
            >
              {hsl}
            </span>
          </div>
        ))}
      </div>
    )
  },
}

export const SemanticColors: Story = {
  render: () => {
    const entries = Object.entries(semanticColors) as [string, string][]
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, hsl]) => (
          <div
            key={name}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div
              style={{
                width: '100%',
                height: '4rem',
                borderRadius: '0.5rem',
                backgroundColor: hsl,
                border: '1px solid hsl(0 0% 90%)',
              }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {name}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: 'hsl(0 0% 45%)',
                fontFamily: 'monospace',
              }}
            >
              {hsl}
            </span>
          </div>
        ))}
      </div>
    )
  },
}

export const TypographySizes: Story = {
  render: () => {
    const entries = Object.entries(fontSizes) as [string, string][]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, size]) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}
          >
            <span
              style={{
                width: '4rem',
                fontSize: '0.75rem',
                color: 'hsl(0 0% 45%)',
              }}
            >
              {name}
            </span>
            <span style={{ fontSize: size, fontFamily: fontFamily.notoSans }}>
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}
      </div>
    )
  },
}

export const TypographyWeights: Story = {
  render: () => {
    const entries = Object.entries(fontWeights) as [string, number][]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, weight]) => (
          <div
            key={name}
            style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}
          >
            <span
              style={{
                width: '4rem',
                fontSize: '0.75rem',
                color: 'hsl(0 0% 45%)',
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontWeight: weight,
                fontSize: '1.25rem',
                fontFamily: fontFamily.notoSans,
              }}
            >
              The quick brown fox jumps over the lazy dog ({weight})
            </span>
          </div>
        ))}
      </div>
    )
  },
}

export const SpacingRulers: Story = {
  render: () => {
    const entries = Object.entries(spacing) as [string, string][]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, value]) => {
          const px = parseFloat(value) * 16
          return (
            <div
              key={name}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <span
                style={{
                  width: '3rem',
                  fontSize: '0.75rem',
                  color: 'hsl(0 0% 45%)',
                }}
              >
                {name}
              </span>
              <div
                style={{
                  width: `${px}px`,
                  height: '1rem',
                  backgroundColor: 'hsl(245 58% 51%)',
                  borderRadius: '2px',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                {value}
              </span>
            </div>
          )
        })}
      </div>
    )
  },
}

export const RadiusCards: Story = {
  render: () => {
    const entries = Object.entries(radius) as [string, string][]
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          padding: '2rem',
        }}
      >
        {entries.map(([name, value]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: 'hsl(245 58% 51%)',
                borderRadius: value,
              }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {name}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: 'hsl(0 0% 45%)',
                fontFamily: 'monospace',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    )
  },
}

export const ShadowSamples: Story = {
  render: () => {
    const entries = Object.entries(shadows) as [string, string][]
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: 'white',
        }}
      >
        {entries.map(([name, shadow]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: 'hsl(245 58% 51%)',
                borderRadius: '0.5rem',
                boxShadow: shadow,
              }}
            />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {name}
            </span>
            <span
              style={{
                fontSize: '0.5rem',
                color: 'hsl(0 0% 45%)',
                fontFamily: 'monospace',
                maxWidth: '6rem',
                textAlign: 'center',
              }}
            >
              {shadow}
            </span>
          </div>
        ))}
      </div>
    )
  },
}
