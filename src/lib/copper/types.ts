export interface CopperInstruction {
  scanline: number;
  register: string;
  value: number;
}

export interface CopperList {
  name: string;
  instructions: CopperInstruction[];
}

export interface ColorBar {
  startLine: number;
  endLine: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

export interface CopperEffect {
  type: 'colorBars' | 'gradient' | 'custom';
  colorBars?: ColorBar[];
  gradient?: {
    startLine: number;
    endLine: number;
    startColor: { r: number; g: number; b: number };
    endColor: { r: number; g: number; b: number };
  };
  custom?: CopperInstruction[];
}