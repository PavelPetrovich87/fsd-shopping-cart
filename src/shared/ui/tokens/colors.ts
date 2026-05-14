export interface PrimitiveColors {
  brand700: string
  brand600: string
  brand100: string
  neutral950: string
  neutral900: string
  neutral800: string
  neutral700: string
  neutral600: string
  neutral500: string
  neutral400: string
  neutral300: string
  neutral200: string
  neutral100: string
  neutral50: string
  error600: string
  brandPrimaryEmphasize: string
}

export const primitiveColors: PrimitiveColors = {
  brand700: 'hsl(245 58% 51%)',
  brand600: 'hsl(246 55% 46%)',
  brand100: 'hsl(230 100% 97%)',
  neutral950: 'hsl(0 0% 4%)',
  neutral900: 'hsl(0 0% 9%)',
  neutral800: 'hsl(0 0% 25%)',
  neutral700: 'hsl(0 0% 32%)',
  neutral600: 'hsl(0 0% 45%)',
  neutral500: 'hsl(0 0% 64%)',
  neutral400: 'hsl(0 0% 83%)',
  neutral300: 'hsl(220 9% 89%)',
  neutral200: 'hsl(0 0% 96%)',
  neutral100: 'hsl(0 0% 98%)',
  neutral50: 'hsl(0 0% 100%)',
  error600: 'hsl(0 72% 50%)',
  brandPrimaryEmphasize: 'hsl(244 55% 41%)',
}

export interface SemanticColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export const semanticColors: SemanticColors = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(0 0% 9%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(0 0% 9%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(0 0% 9%)',
  primary: 'hsl(245 58% 51%)',
  primaryForeground: 'hsl(0 0% 100%)',
  secondary: 'hsl(0 0% 98%)',
  secondaryForeground: 'hsl(0 0% 9%)',
  muted: 'hsl(0 0% 98%)',
  mutedForeground: 'hsl(0 0% 45%)',
  accent: 'hsl(0 0% 98%)',
  accentForeground: 'hsl(0 0% 9%)',
  destructive: 'hsl(0 72% 50%)',
  destructiveForeground: 'hsl(0 0% 100%)',
  border: 'hsl(220 9% 89%)',
  input: 'hsl(0 0% 98%)',
  ring: 'hsl(245 58% 51%)',
}

export interface ComponentColors {
  buttonFocusRing: string
  buttonErrorRing: string
  inputFocus: string
  inputError: string
}

export const componentColors: ComponentColors = {
  buttonFocusRing: 'hsl(245 59% 55%)',
  buttonErrorRing: 'hsl(0 72% 50%)',
  inputFocus: 'hsl(245 59% 55%)',
  inputError: 'hsl(0 72% 50%)',
}
