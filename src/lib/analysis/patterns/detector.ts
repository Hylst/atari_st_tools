import { Instruction } from '../cpu/types';

export interface OptimizationPattern {
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export function detectOptimizationPatterns(instructions: Instruction[]): OptimizationPattern[] {
  const patterns: OptimizationPattern[] = [];
  
  // Détection des multiplications/divisions coûteuses
  const expensiveOps = instructions.filter(
    inst => ['muls', 'mulu', 'divs', 'divu'].some(op => inst.mnemonic.startsWith(op))
  );
  
  if (expensiveOps.length > 0) {
    patterns.push({
      name: 'Opérations coûteuses',
      description: `${expensiveOps.length} multiplication(s)/division(s) détectées. Envisagez d'utiliser des shifts ou des tables précalculées.`,
      severity: expensiveOps.length > 3 ? 'critical' : 'warning'
    });
  }
  
  // Détection des accès mémoire non alignés
  const memoryAccesses = instructions.filter(
    inst => inst.ea && ['d16(An)', 'd8(An,Dn)', '(xxx).W', '(xxx).L'].includes(inst.ea)
  );
  
  if (memoryAccesses.length > 5) {
    patterns.push({
      name: 'Accès mémoire fréquents',
      description: 'Nombreux accès mémoire détectés. Envisagez d\'utiliser des registres pour les variables fréquemment utilisées.',
      severity: 'warning'
    });
  }
  
  // Détection des instructions byte vs word
  const byteOps = instructions.filter(inst => inst.mnemonic.endsWith('.b'));
  if (byteOps.length > 5) {
    patterns.push({
      name: 'Opérations sur des bytes',
      description: 'Nombreuses opérations sur des bytes. Les opérations sur des words sont généralement plus efficaces sur le 68000.',
      severity: 'info'
    });
  }
  
  // Détection des boucles potentielles
  const branchBackCount = countBranchBackInstructions(instructions);
  if (branchBackCount > 2) {
    patterns.push({
      name: 'Boucles potentielles',
      description: 'Plusieurs branchements arrière détectés. Envisagez de dérouler les boucles critiques.',
      severity: 'info'
    });
  }
  
  return patterns;
}

function countBranchBackInstructions(instructions: Instruction[]): number {
  // Simplification: on compte juste les instructions de branchement
  return instructions.filter(
    inst => ['bra', 'beq', 'bne', 'bgt', 'bge', 'blt', 'ble', 'dbra', 'dbf'].some(
      op => inst.mnemonic.startsWith(op)
    )
  ).length;
}