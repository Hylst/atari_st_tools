export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface AtariPalette {
  name: string;
  colors: RGB[];
}

export interface GradientOptions {
  startColor: RGB;
  endColor: RGB;
  steps: number;
}