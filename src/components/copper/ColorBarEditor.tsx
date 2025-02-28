import React, { useState } from 'react';
import { ColorBar } from '../../lib/copper/types';
import { RGB } from '../../lib/palette/types';
import ColorPicker from '../palette/ColorPicker';

interface ColorBarEditorProps {
  colorBars: ColorBar[];
  onChange: (colorBars: ColorBar[]) => void;
}

const ColorBarEditor: React.FC<ColorBarEditorProps> = ({ colorBars, onChange }) => {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  
  const handleAddBar = () => {
    const newBar: ColorBar = {
      startLine: 50,
      endLine: 100,
      color: { r: 255, g: 0, b: 0 }
    };
    onChange([...colorBars, newBar]);
    setSelectedBar(colorBars.length);
  };
  
  const handleRemoveBar = (index: number) => {
    const newBars = colorBars.filter((_, i) => i !== index);
    onChange(newBars);
    setSelectedBar(null);
  };
  
  const handleUpdateBar = (index: number, updates: Partial<ColorBar>) => {
    const newBars = [...colorBars];
    newBars[index] = { ...newBars[index], ...updates };
    onChange(newBars);
  };
  
  const handleColorChange = (color: RGB) => {
    if (selectedBar !== null) {
      handleUpdateBar(selectedBar, { color });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Barres de couleur</h3>
        <button
          onClick={handleAddBar}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          Ajouter une barre
        </button>
      </div>
      
      <div className="space-y-2">
        {colorBars.map((bar, index) => (
          <div 
            key={index}
            className={`p-3 border rounded cursor-pointer ${
              selectedBar === index ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedBar(index)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: `rgb(${bar.color.r},${bar.color.g},${bar.color.b})` }}
                />
                <span>Ligne {bar.startLine} à {bar.endLine}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBar(index);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        {colorBars.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Aucune barre de couleur. Cliquez sur "Ajouter une barre" pour commencer.
          </div>
        )}
      </div>
      
      {selectedBar !== null && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Éditer la barre</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ligne de début
              </label>
              <input
                type="number"
                min="0"
                max="199"
                value={colorBars[selectedBar].startLine}
                onChange={(e) => handleUpdateBar(selectedBar, { startLine: parseInt(e.target.value) })}
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
                value={colorBars[selectedBar].endLine}
                onChange={(e) => handleUpdateBar(selectedBar, { endLine: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couleur
            </label>
            <ColorPicker
              color={colorBars[selectedBar].color}
              onChange={handleColorChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorBarEditor;