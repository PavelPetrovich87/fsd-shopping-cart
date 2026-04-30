export type ShadowToken = string;

export interface ShadowScale {
  subtle: ShadowToken;
  medium: ShadowToken;
  large: ShadowToken;
  focusRing: ShadowToken;
  errorRing: ShadowToken;
}

export const shadows: ShadowScale = {
  subtle: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  medium: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  focusRing: '0 0 0 4px rgba(68,76,231,0.12)',
  errorRing: '0 0 0 4px rgba(217,45,32,0.12)',
};
