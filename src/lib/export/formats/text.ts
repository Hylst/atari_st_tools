import { Instruction } from '../../analysis/cpu/types';
import { OptimizationPattern } from '../../analysis/patterns/detector';

export function exportAnalysisToText(
  instructions: Instruction[],
  totalCycles: number,
  criticalPath: Instruction[],
  patterns: OptimizationPattern[]
): string {
  const lines: string[] = [
    '=== ANALYSE DE CYCLES CPU 68000 ===',
    '',
    `Total des cycles: ${totalCycles}`,
    `Pourcentage d'une frame: ${(totalCycles / 160256 * 100).toFixed(1)}%`,
    '',
    '--- INSTRUCTIONS ANALYSÉES ---'
  ];
  
  // Ajouter les instructions avec leurs cycles
  instructions.forEach(inst => {
    lines.push(`${inst.mnemonic.padEnd(10)} ${inst.cycles} cycles`);
  });
  
  // Ajouter le chemin critique
  if (criticalPath.length > 0) {
    lines.push('');
    lines.push('--- CHEMIN CRITIQUE ---');
    criticalPath.forEach(inst => {
      lines.push(`${inst.mnemonic.padEnd(10)} ${inst.cycles} cycles`);
    });
  }
  
  // Ajouter les patterns d'optimisation
  if (patterns.length > 0) {
    lines.push('');
    lines.push('--- PATTERNS D\'OPTIMISATION ---');
    patterns.forEach(pattern => {
      lines.push(`[${pattern.severity.toUpperCase()}] ${pattern.name}`);
      lines.push(`  ${pattern.description}`);
    });
  }
  
  // Ajouter des suggestions générales
  lines.push('');
  lines.push('--- SUGGESTIONS D\'OPTIMISATION ---');
  lines.push('• Remplacer les multiplications par des shifts quand possible');
  lines.push('• Utiliser des lookup tables pour les calculs complexes');
  lines.push('• Dérouler les boucles critiques');
  lines.push('• Utiliser des instructions word plutôt que byte quand possible');
  lines.push('• Optimiser l\'accès aux données (alignment, cache)');
  
  return lines.join('\n');
}