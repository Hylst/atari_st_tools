import { Point, CurveParameters, CurveGenerator } from './types';

export const generateSine: CurveGenerator = ({ amplitude = 100, frequency = 1, phase = 0, steps = 100 }) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const x = (i / steps) * 2 * Math.PI;
    const y = amplitude * Math.sin(frequency * x + phase);
    points.push({ x: i * (400 / steps), y: 200 + y });
  }
  return points;
};

export const generateCircle: CurveGenerator = ({ radius = 100, steps = 100 }) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push({ x: 200 + x, y: 200 + y });
  }
  return points;
};

export const generateSpiral: CurveGenerator = ({ radius = 100, loops = 3, steps = 100 }) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI * loops;
    const r = (radius * i) / steps;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    points.push({ x: 200 + x, y: 200 + y });
  }
  return points;
};

export const generateLissajous: CurveGenerator = ({ 
  amplitude = 100, 
  frequency = 1, 
  phaseX = 0,
  phaseY = Math.PI / 2,
  steps = 100 
}) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const x = amplitude * Math.sin(frequency * t + phaseX);
    const y = amplitude * Math.sin(2 * frequency * t + phaseY);
    points.push({ x: 200 + x, y: 200 + y });
  }
  return points;
};

export const generateRose: CurveGenerator = ({
  radius = 100,
  petals = 5,
  steps = 100
}) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const r = radius * Math.cos(petals * angle);
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    points.push({ x: 200 + x, y: 200 + y });
  }
  return points;
};

export const generateEpicycloid: CurveGenerator = ({
  R = 100, // Rayon du cercle fixe
  r = 30,  // Rayon du cercle mobile
  steps = 100
}) => {
  const points: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const x = (R + r) * Math.cos(t) - r * Math.cos((R + r) * t / r);
    const y = (R + r) * Math.sin(t) - r * Math.sin((R + r) * t / r);
    points.push({ x: 200 + x, y: 200 + y });
  }
  return points;
};