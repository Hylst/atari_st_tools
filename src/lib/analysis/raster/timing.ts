export interface RasterTiming {
  vblStart: number;  // cycles from frame start
  vblEnd: number;
  scanlineTime: number;
  frameTime: number;
}

export function analyzeRasterTiming(code: string): RasterTiming {
  const timing: RasterTiming = {
    vblStart: 0,
    vblEnd: 2500,    // ~50 scanlines
    scanlineTime: 512, // 512 cycles per scanline
    frameTime: 160 * 512 // 160 scanlines total
  };

  // Analyze code for VBL wait and critical timing sections
  const vblWaitPos = code.indexOf('vbl_wait');
  if (vblWaitPos >= 0) {
    // Adjust timing based on VBL wait position
    timing.vblStart = estimatePosition(code.slice(0, vblWaitPos)) * timing.scanlineTime;
  }

  return timing;
}

function estimatePosition(code: string): number {
  // Estimate code position in scanlines
  const instructions = code.split('\n').length;
  return Math.floor(instructions * 4 / 512); // Rough estimate: 4 cycles per instruction
}