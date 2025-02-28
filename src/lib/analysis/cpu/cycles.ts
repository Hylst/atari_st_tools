import { Instruction, CycleAnalysis } from './types';

const instructionCycles: Record<string, number> = {
  // Déplacements de données
  'move.b': 4,
  'move.w': 4,
  'move.l': 4,
  'movea.w': 4,
  'movea.l': 4,
  'moveq': 4,
  'movem': 8,
  
  // Opérations arithmétiques
  'add.b': 4,
  'add.w': 4,
  'add.l': 6,
  'addq': 4,
  'sub.b': 4,
  'sub.w': 4,
  'sub.l': 6,
  'subq': 4,
  
  // Multiplications et divisions
  'muls.w': 40,
  'mulu.w': 40,
  'divs.w': 90,
  'divu.w': 80,
  
  // Opérations logiques
  'and.b': 4,
  'and.w': 4,
  'and.l': 6,
  'or.b': 4,
  'or.w': 4,
  'or.l': 6,
  'eor.w': 4,
  'not.w': 4,
  
  // Shifts et rotations
  'lsl.b': 6,
  'lsl.w': 6,
  'lsr.b': 6,
  'lsr.w': 6,
  'asl.w': 6,
  'asr.w': 6,
  'rol.w': 6,
  'ror.w': 6,
  
  // Branchements
  'bra': 10,
  'beq': 8,
  'bne': 8,
  'bgt': 8,
  'bge': 8,
  'blt': 8,
  'ble': 8,
  'bsr': 18,
  'rts': 16,
  
  // Comparaisons
  'cmp.b': 4,
  'cmp.w': 4,
  'cmp.l': 6,
  'cmpi.w': 8,
  'tst.w': 4,
  
  // Divers
  'clr.w': 4,
  'ext.w': 4,
  'swap': 4,
  'lea': 4,
  'nop': 4
};

export function analyzeCycles(instructions: Instruction[]): CycleAnalysis {
  let totalCycles = 0;
  const criticalPath: Instruction[] = [];

  instructions.forEach(inst => {
    const baseCycles = instructionCycles[inst.mnemonic] || 4;
    const eaCycles = calculateEACycles(inst.ea);
    const totalInstCycles = baseCycles + eaCycles;
    
    totalCycles += totalInstCycles;
    inst.cycles = totalInstCycles;
    
    if (totalInstCycles > 10) {
      criticalPath.push(inst);
    }
  });

  return {
    totalCycles,
    instructions,
    criticalPath: criticalPath.sort((a, b) => b.cycles - a.cycles)
  };
}

function calculateEACycles(ea?: string): number {
  if (!ea) return 0;
  
  // Cycles additionnels selon le mode d'adressage
  switch (ea) {
    case 'Dn':
    case 'An': 
      return 0;
    case '(An)': 
      return 4;
    case '(An)+':
    case '-(An)':
      return 6;
    case 'd16(An)':
    case 'd16(PC)':
      return 8;
    case 'd8(An,Dn)':
    case 'd8(An,An)':
      return 10;
    case '(xxx).W':
      return 8;
    case '(xxx).L':
      return 12;
    case '#imm':
      return 4;
    default:
      return 2;
  }
}