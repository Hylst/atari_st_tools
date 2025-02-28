import { RGB, GradientOptions } from './types';

export function generateGradient({ startColor, endColor, steps }: GradientOptions): RGB[] {
  const colors: RGB[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    colors.push({
      r: Math.round(startColor.r + (endColor.r - startColor.r) * t),
      g: Math.round(startColor.g + (endColor.g - startColor.g) * t),
      b: Math.round(startColor.b + (endColor.b - startColor.b) * t)
    });
  }
  return colors;
}

export function optimizePalette(colors: RGB[]): RGB[] {
  // Quantize to Atari ST color space (3 bits per channel)
  return colors.map(color => ({
    r: Math.round(color.r / 255 * 7) * 255 / 7,
    g: Math.round(color.g / 255 * 7) * 255 / 7,
    b: Math.round(color.b / 255 * 7) * 255 / 7
  }));
}

export function exportPalette(colors: RGB[]): Uint8Array {
  const data = new Uint8Array(32); // 16 colors * 2 bytes
  colors.forEach((color, i) => {
    const value = (
      ((Math.round(color.r / 255 * 7) & 0x7) << 8) |
      ((Math.round(color.g / 255 * 7) & 0x7) << 4) |
      (Math.round(color.b / 255 * 7) & 0x7)
    );
    data[i * 2] = (value >> 8) & 0xFF;
    data[i * 2 + 1] = value & 0xFF;
  });
  return data;
}