import React, { useState, useEffect } from 'react';
import { Download, Code, Info } from 'lucide-react';
import ColorBarEditor from '../components/copper/ColorBarEditor';
import CopperPreview from '../components/copper/CopperPreview';
import { ColorBar, CopperEffect, CopperList } from '../lib/copper/types';
import { generateCopperList, exportToASM } from '../lib/copper/generator';

const CopperGenerator: React.FC = () => {
  const [effectType, setEffectType] = useState<'colorBars' | 'gradient' | 'custom'>('colorBars');
  const [colorBars, setColorBars] = useState<ColorBar[]>([
    { startLine: 20, endLine: 50, color: { r: 255, g: 0, b: 0 } },
    { startLine: 70, endLine: 100, color: { r: 0, g: 255, b: 0 } },
    { startLine: 120, endLine: 150, color: { r: 0, g: 0, b: 255 } }
  ]);
  const [gradient, setGradient] = useState({
    startLine: 0,
    endLine: 199,
    startColor: { r: 0, g: 0, b: 0 },
    endColor: { r: 255, g: 0, b: 0 }
  });
  const [copperList, setCopperList] = useState<CopperList>({ name: 'copper_list', instructions: [] });
  const [asmCode, setAsmCode] = useState<string>('');
  
  // Générer la liste copper à chaque changement
  useEffect(() => {
    const effect: CopperEffect = {
      type: effectType,
      colorBars: effectType === 'colorBars' ? colorBars : undefined,
      gradient: effectType === 'gradient' ? gradient : undefined
    };
    
    const newCopperList = generateCopperList(effect);
    setCopperList(newCopperList);
    setAsmCode(exportToASM(newCopperList));
  }, [effectType, colorBars, gradient]);
  
  const handleExport = () => {
    const blob = new Blob([asmCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${copperList.name}.s`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Générateur de Copper List</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <Info className="w-6 h-6 text-blue-400 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Qu'est-ce qu'une Copper List?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Une "Copper List" est une liste d'instructions exécutées en synchronisation avec le balayage de l'écran.</p>
                <p className="mt-1">Elle permet de créer des effets comme:</p>
                <ul className="list-disc mt-1 ml-4 space-y-1">
                  <li>Barres de couleur horizontales</li>
                  <li>Dégradés verticaux</li>
                  <li>Modifications de palette en temps réel</li>
                  <li>Effets de parallaxe hardware</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Prévisualisation</h3>
            <CopperPreview copperList={copperList} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Assembleur
            </h3>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm font-mono h-64">
              {asmCode}
            </pre>
            <button
              onClick={handleExport}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" />
              Exporter en Assembleur
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Type d'effet</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={effectType === 'colorBars'}
                  onChange={() => setEffectType('colorBars')}
                  className="mr-2"
                />
                Barres de couleur
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={effectType === 'gradient'}
                  onChange={() => setEffectType('gradient')}
                  className="mr-2"
                />
                Dégradé vertical
              </label>
            </div>
          </div>
          
          {effectType === 'colorBars' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ColorBarEditor
                colorBars={colorBars}
                onChange={setColorBars}
              />
            </div>
          )}
          
          {effectType === 'gradient' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Dégradé vertical</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ligne de début
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="199"
                      value={gradient.startLine}
                      onChange={(e) => setGradient({
                        ...gradient,
                        startLine: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ligne de fin
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={gradient.endLine}
                      onChange={(e) => setGradient({
                        ...gradient,
                        endLine: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur de début
                  </label>
                  <div className="flex gap-2 items-center">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ 
                        backgroundColor: `rgb(${gradient.startColor.r},${gradient.startColor.g},${gradient.startColor.b})` 
                      }}
                    />
                    <input
                      type="color"
                      value={`#${gradient.startColor.r.toString(16).padStart(2, '0')}${gradient.startColor.g.toString(16).padStart(2, '0')}${gradient.startColor.b.toString(16).padStart(2, '0')}`}
                      onChange={(e) => {
                        const hex = e.target.value.substring(1);
                        setGradient({
                          ...gradient,
                          startColor: {
                            r: parseInt(hex.substring(0, 2), 16),
                            g: parseInt(hex.substring(2, 4), 16),
                            b: parseInt(hex.substring(4, 6), 16)
                          }
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur de fin
                  </label>
                  <div className="flex gap-2 items-center">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ 
                        backgroundColor: `rgb(${gradient.endColor.r},${gradient.endColor.g},${gradient.endColor.b})` 
                      }}
                    />
                    <input
                      type="color"
                      value={`#${gradient.endColor.r.toString(16).padStart(2, '0')}${gradient.endColor.g.toString(16).padStart(2, '0')}${gradient.endColor.b.toString(16).padStart(2, '0')}`}
                      onChange={(e) => {
                        const hex = e.target.value.substring(1);
                        setGradient({
                          ...gradient,
                          endColor: {
                            r: parseInt(hex.substring(0, 2), 16),
                            g: parseInt(hex.substring(2, 4), 16),
                            b: parseInt(hex.substring(4, 6), 16)
                          }
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Informations</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Instructions:</span> {copperList.instructions.length}
              </p>
              <p>
                <span className="font-medium">Taille estimée:</span> {copperList.instructions.length * 4 + 4} octets
              </p>
              <p>
                <span className="font-medium">Registres utilisés:</span> COLOR00
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Note: Sur l'Atari ST, cette fonctionnalité nécessite une programmation avancée du matériel vidéo et une synchronisation précise avec le VBL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopperGenerator;