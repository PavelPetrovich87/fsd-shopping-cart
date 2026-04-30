export interface FontFamily {
  notoSans: string;
  fallback: string;
}

export const fontFamily: FontFamily = {
  notoSans: "'Noto Sans', system-ui, sans-serif",
  fallback: 'system-ui, sans-serif',
};

export interface TypographySizeScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export const fontSizes: TypographySizeScale = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '4.5rem',
};

export interface FontWeightScale {
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
}

export const fontWeights: FontWeightScale = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export interface LineHeightScale {
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

export const lineHeights: LineHeightScale = {
  tight: '1.0',
  snug: '1.11',
  normal: '1.2',
  relaxed: '1.33',
  loose: '1.5',
};

export const letterSpacing: string = '0';

export interface TypographyTokens {
  fontFamily: FontFamily;
  fontSizes: TypographySizeScale;
  fontWeights: FontWeightScale;
  lineHeights: LineHeightScale;
  letterSpacing: string;
}
