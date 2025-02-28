import React from 'react';
import { analyzeCycles } from '../../lib/analysis/cpu/cycles';
import { Instruction } from '../../lib/analysis/cpu/types';

interface CycleAnalyzerProps {
  code: string;
}

const CycleAnalyzer: React.FC<CycleAnalyzerProps> = ({ code }) => {
  // Parse code into instructions
  const instructions: Instruction[] = code.split('\n')
    .map(line => ({
      mnemonic: line.trim().split(' ')[0],
      size: 2,
      cycles: 4
    }))
    .filter(inst => inst.mnemonic);

  const analysis = analyzeCycles(instructions);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Analyse des cycles</h3>
        <p className="text-2xl font-bold text-indigo-600">
          {analysis.totalCycles} cycles
        </p>
        <p className="text-sm text-gray-500">
          {(analysis.totalCycles / 50000).toFixed(1)}% du VBL
        </p>
      </div>

      {analysis.criticalPath.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">
            Chemin critique
          </h4>
          <ul className="space-y-1 text-sm text-yellow-700">
            {analysis.criticalPath.map((inst, i) => (
              <li key={i}>{inst.mnemonic} ({inst.cycles} cycles)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CycleAnalyzer;