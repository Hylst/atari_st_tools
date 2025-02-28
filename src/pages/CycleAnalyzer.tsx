import React, { useState } from 'react';
import { Info, Clock, AlertTriangle, Download, FileText, FileCode } from 'lucide-react';
import { analyzeCycles } from '../lib/analysis/cpu/cycles';
import { parseInstruction } from '../lib/analysis/cpu/parser';
import { Instruction } from '../lib/analysis/cpu/types';
import { detectOptimizationPatterns } from '../lib/analysis/patterns/detector';
import { analyzeRasterTiming } from '../lib/analysis/raster/timing';
import RasterVisualizer from '../components/analysis/RasterVisualizer';
import OptimizationPatterns from '../components/analysis/OptimizationPatterns';
import { exportAnalysisToText } from '../lib/export/formats/text';
import { exportAnalysisToHTML } from '../lib/export/formats/html';

const CycleAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [analysis, setAnalysis] = useState<{
    totalCycles: number;
    instructions: Instruction[];
    criticalPath: Instruction[];
    patterns: any[];
    timing: any;
  } | null>(null);

  const handleAnalyze = () => {
    const instructions = code
      .split('\n')
      .map(line => parseInstruction(line))
      .filter((inst): inst is Instruction => inst !== null);

    const result = analyzeCycles(instructions);
    const patterns = detectOptimizationPatterns(instructions);
    const timing = analyzeRasterTiming(code);
    
    setAnalysis({
      ...result,
      patterns,
      timing
    });
  };
  
  const handleExport = (format: 'text' | 'html') => {
    if (!analysis) return;
    
    let content = '';
    let filename = '';
    let type = '';
    
    if (format === 'text') {
      content = exportAnalysisToText(
        analysis.instructions,
        analysis.totalCycles,
        analysis.criticalPath,
        analysis.patterns
      );
      filename = 'cycle_analysis.txt';
      type = 'text/plain';
    } else {
      content = exportAnalysisToHTML(
        analysis.instructions,
        analysis.totalCycles,
        analysis.criticalPath,
        analysis.patterns
      );
      filename = 'cycle_analysis.html';
      type = 'text/html';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Analyseur de Cycles CPU</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <Info className="w-6 h-6 text-blue-400 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Analyse des cycles du 68000</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Estimez le temps d'exécution de votre code :</p>
                <ul className="list-disc mt-2 ml-4 space-y-1">
                  <li>Calcul des cycles par instruction</li>
                  <li>Identification des sections critiques</li>
                  <li>Optimisation pour le VBL (50Hz = 160256 cycles)</li>
                  <li>Visualisation du timing raster</li>
                  <li>Détection des patterns d'optimisation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Code Assembleur</h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 font-mono text-sm p-4 border rounded"
              placeholder="; Entrez votre code assembleur 68000 ici
move.w  d0,d1
add.w   d1,d2
mulu.w  d2,d3
..."
            />
            <button
              onClick={handleAnalyze}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Analyser
            </button>
          </div>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Résultats de l'analyse
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {analysis.totalCycles} cycles
                  </div>
                  <div className="text-sm text-gray-500">
                    {(analysis.totalCycles / 160256 * 100).toFixed(1)}% d'une frame (VBL)
                  </div>
                </div>

                {analysis.totalCycles > 160256 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                      <div className="text-sm text-yellow-700">
                        Attention : Le code dépasse la durée d'une frame !
                      </div>
                    </div>
                  </div>
                )}

                {analysis.criticalPath.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Instructions coûteuses</h4>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      {analysis.criticalPath.map((inst, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{inst.mnemonic}</span>
                          <span className="text-gray-500">{inst.cycles} cycles</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('text')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <FileText className="w-4 h-4" />
                    Exporter en TXT
                  </button>
                  <button
                    onClick={() => handleExport('html')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <FileCode className="w-4 h-4" />
                    Exporter en HTML
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Visualisation Raster</h3>
              <RasterVisualizer 
                timing={analysis.timing}
                totalCycles={analysis.totalCycles}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Patterns d'optimisation détectés</h3>
              <OptimizationPatterns patterns={analysis.patterns} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Optimisations suggérées</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {analysis.totalCycles > 160256 && (
                  <li>• Répartir le code sur plusieurs frames</li>
                )}
                {analysis.criticalPath.length > 0 && (
                  <>
                    <li>• Remplacer les multiplications par des shifts quand possible</li>
                    <li>• Utiliser des lookup tables pour les calculs complexes</li>
                    <li>• Dérouler les boucles critiques</li>
                  </>
                )}
                <li>• Utiliser des instructions word plutôt que byte quand possible</li>
                <li>• Optimiser l'accès aux données (alignment, cache)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleAnalyzer;