import { RGB } from './types';

export function rgbToAtariColor(rgb: RGB): number {
  const r = Math.round((rgb.r / 255) * 7);
  const g = Math.round((rgb.g / 255) * 7);
  const b = Math.round((rgb.b / 255) * 7);
  return (r << 8) | (g << 4) | b;
}

export function atariColorToRGB(color: number): RGB {
  const r = ((color >> 8) & 0x7) * 255 / 7;
  const g = ((color >> 4) & 0x7) * 255 / 7;
  const b = (color & 0x7) * 255 / 7;
  return { r, g, b };
}

export function findClosestColor(rgb: RGB, palette: RGB[]): number {
  return palette.reduce((best, color, index) => {
    const dr = rgb.r - color.r;
    const dg = rgb.g - color.g;
    const db = rgb.b - color.b;
    const distance = dr * dr + dg * dg + db * db;
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity }).index;
}