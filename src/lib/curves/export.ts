import { Point } from './types';

export const exportToASM = (points: Point[]): string => {
  return points.map(p => `\tdc.w\t${Math.round(p.x)},${Math.round(p.y)}`).join('\n');
};

export const exportToC = (points: Point[]): string => {
  const values = points.map(p => `{${Math.round(p.x)}, ${Math.round(p.y)}}`).join(',\n  ');
  return `const POINT points[] = {\n  ${values}\n};`;
};

export const exportToJSON = (points: Point[]): string => {
  return JSON.stringify(points, null, 2);
};