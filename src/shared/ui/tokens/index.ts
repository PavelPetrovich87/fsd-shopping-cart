import type { PrimitiveColors, SemanticColors, ComponentColors } from './colors'
import type {
  FontFamily,
  TypographySizeScale,
  FontWeightScale,
  LineHeightScale,
} from './typography'
import type { SpacingScale } from './spacing'
import type { RadiusScale } from './radius'
import type { ShadowScale } from './shadows'
import type { Breakpoints } from './breakpoints'
import type { ZIndexScale } from './z-index'

export interface Theme {
  colors: {
    primitive: PrimitiveColors
    semantic: SemanticColors
    component: ComponentColors
  }
  typography: {
    fontFamily: FontFamily
    fontSizes: TypographySizeScale
    fontWeights: FontWeightScale
    lineHeights: LineHeightScale
    letterSpacing: string
  }
  spacing: SpacingScale
  radius: RadiusScale
  shadows: ShadowScale
  breakpoints: Breakpoints
  zIndex: ZIndexScale
}

import { primitiveColors, semanticColors, componentColors } from './colors'
import {
  fontFamily,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
} from './typography'
import { spacing } from './spacing'
import { radius } from './radius'
import { shadows } from './shadows'
import { breakpoints } from './breakpoints'
import { zIndex } from './z-index'

export const theme: Theme = {
  colors: {
    primitive: primitiveColors,
    semantic: semanticColors,
    component: componentColors,
  },
  typography: {
    fontFamily,
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacing,
  },
  spacing,
  radius,
  shadows,
  breakpoints,
  zIndex,
}

export type { PrimitiveColors, SemanticColors, ComponentColors } from './colors'
export { primitiveColors, semanticColors, componentColors } from './colors'

export type {
  FontFamily,
  TypographySizeScale,
  FontWeightScale,
  LineHeightScale,
} from './typography'
export {
  fontFamily,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
} from './typography'

export type { SpacingScale } from './spacing'
export { spacing } from './spacing'

export type { RadiusScale } from './radius'
export { radius } from './radius'

export type { ShadowScale } from './shadows'
export { shadows } from './shadows'

export type { Breakpoints } from './breakpoints'
export { breakpoints } from './breakpoints'

export type { ZIndexScale } from './z-index'
export { zIndex } from './z-index'
