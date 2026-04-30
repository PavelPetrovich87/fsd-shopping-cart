export interface ZIndexScale {
  dropdown: number;
  sticky: number;
  modal: number;
  tooltip: number;
  toast: number;
}

export const zIndex: ZIndexScale = {
  dropdown: 100,
  sticky: 200,
  modal: 300,
  tooltip: 400,
  toast: 500,
};
