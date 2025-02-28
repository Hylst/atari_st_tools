export interface Instruction {
  mnemonic: string;
  size: number;
  cycles: number;
  ea?: string; // Effective Address
}

export interface CycleAnalysis {
  totalCycles: number;
  instructions: Instruction[];
  criticalPath: Instruction[];
}

export interface TimingConstraints {
  vblDuration: number;    // cycles
  scanlineDuration: number; // cycles
  maxInstructions: number;
}