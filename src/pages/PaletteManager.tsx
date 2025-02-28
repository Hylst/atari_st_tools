import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import ColorPicker from '../components/palette/ColorPicker';
import GradientGenerator from '../components/palette/GradientGenerator';
import PalettePreview from '../components/palette/PalettePreview';
import { RGB, AtariPalette } from '../lib/palette/types';
import { optimizePalette, exportPalette } from '../lib/palette/utils';

const defaultPalette: RGB[] = Array(16).fill({ r: 0, g: 0, b: 0 });

const PaletteManager: React.FC = () => {
  const [palette, setPalette] = useState<AtariPalette>({
    name: 'Nouvelle palette',
    colors: defaultPalette
  });
  const [selectedColor, setSelectedColor] = useState<number>(0);

  const handleColorChange = useCallback((color: RGB) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === selectedColor ? color : c)
    }));
  }, [selectedColor]);

  const handleGradient = useCallback((colors: RGB[]) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i < colors.length ? colors[i] : c)
    }));
  }, []);

  const handleOptimize = useCallback(() => {
    setPalette(prev => ({
      ...prev,
      colors: optimizePalette(prev.colors)
    }));
  }, []);

  const handleExport = useCallback(() => {
    const data = exportPalette(palette.colors);
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name}.pal`;
    a.click();
    URL.revokeObjectURL(url);
  }, [palette]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestionnaire de Palettes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Palette</h3>
            <PalettePreview
              colors={palette.colors}
              selectedIndex={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Couleur sélectionnée</h3>
            <ColorPicker
              color={palette.colors[selectedColor]}
              onChange={handleColorChange}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Générateur de dégradés</h3>
            <GradientGenerator onGenerate={handleGradient} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <button
              onClick={handleOptimize}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Optimiser pour Atari ST
            </button>
            
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaletteManager;