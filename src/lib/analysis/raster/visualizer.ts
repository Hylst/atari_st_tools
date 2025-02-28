import { RasterTiming } from './timing';

export interface ScanlineInfo {
  number: number;
  cycles: number;
  instructions: string[];
  isVBL: boolean;
}

export function visualizeRasterTiming(timing: RasterTiming): ScanlineInfo[] {
  const scanlines: ScanlineInfo[] = [];
  
  for (let i = 0; i < 200; i++) {
    const cycleStart = i * timing.scanlineTime;
    scanlines.push({
      number: i,
      cycles: timing.scanlineTime,
      instructions: [],
      isVBL: cycleStart >= timing.vblStart && cycleStart < timing.vblEnd
    });
  }
  
  return scanlines;
}