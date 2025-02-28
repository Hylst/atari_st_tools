import { Instruction } from '../../analysis/cpu/types';
import { OptimizationPattern } from '../../analysis/patterns/detector';

export function exportAnalysisToHTML(
  instructions: Instruction[],
  totalCycles: number,
  criticalPath: Instruction[],
  patterns: OptimizationPattern[]
): string {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analyse de Cycles CPU 68000</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2 { color: #4f46e5; }
    .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .critical { color: #b91c1c; }
    .warning { color: #d97706; }
    .info { color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f9fafb; }
    .pattern { padding: 10px; border-radius: 8px; margin-bottom: 10px; }
    .pattern-critical { background-color: #fee2e2; }
    .pattern-warning { background-color: #fef3c7; }
    .pattern-info { background-color: #dbeafe; }
  </style>
</head>
<body>
  <h1>Analyse de Cycles CPU 68000</h1>
  
  <div class="summary">
    <h2>Résumé</h2>
    <p><strong>Total des cycles:</strong> ${totalCycles}</p>
    <p><strong>Pourcentage d'une frame:</strong> ${(totalCycles / 160256 * 100).toFixed(1)}%</p>
    <p><strong>Nombre d'instructions:</strong> ${instructions.length}</p>
    <p><strong>Instructions critiques:</strong> ${criticalPath.length}</p>
  </div>
  
  ${patterns.length > 0 ? `
  <h2>Patterns d'Optimisation</h2>
  ${patterns.map(pattern => `
    <div class="pattern pattern-${pattern.severity}">
      <h3 class="${pattern.severity}">${pattern.name}</h3>
      <p>${pattern.description}</p>
    </div>
  `).join('')}
  ` : ''}
  
  ${criticalPath.length > 0 ? `
  <h2>Chemin Critique</h2>
  <table>
    <thead>
      <tr>
        <th>Instruction</th>
        <th>Cycles</th>
      </tr>
    </thead>
    <tbody>
      ${criticalPath.map(inst => `
        <tr>
          <td>${inst.mnemonic}</td>
          <td class="critical">${inst.cycles}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}
  
  <h2>Toutes les Instructions</h2>
  <table>
    <thead>
      <tr>
        <th>Instruction</th>
        <th>Cycles</th>
      </tr>
    </thead>
    <tbody>
      ${instructions.map(inst => `
        <tr>
          <td>${inst.mnemonic}</td>
          <td>${inst.cycles}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <h2>Suggestions d'Optimisation</h2>
  <ul>
    <li>Remplacer les multiplications par des shifts quand possible</li>
    <li>Utiliser des lookup tables pour les calculs complexes</li>
    <li>Dérouler les boucles critiques</li>
    <li>Utiliser des instructions word plutôt que byte quand possible</li>
    <li>Optimiser l'accès aux données (alignment, cache)</li>
  </ul>
</body>
</html>
  `;
  
  return html;
}