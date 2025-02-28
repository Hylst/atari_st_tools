import React, { useState, useCallback } from 'react';
import { RGB } from '../../lib/palette/types';
import { generateGradient } from '../../lib/palette/utils';
import ColorPicker from './ColorPicker';

interface GradientGeneratorProps {
  onGenerate: (colors: RGB[]) => void;
}

const GradientGenerator: React.FC<GradientGeneratorProps> = ({ onGenerate }) => {
  const [startColor, setStartColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [endColor, setEndColor] = useState<RGB>({ r: 255, g: 255, b: 255 });
  const [steps, setSteps] = useState(4);

  const handleGenerate = useCallback(() => {
    const colors = generateGradient({ startColor, endColor, steps });
    onGenerate(colors);
  }, [startColor, endColor, steps, onGenerate]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Couleur de départ</h4>
        <ColorPicker color={startColor} onChange={setStartColor} />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Couleur d'arrivée</h4>
        <ColorPicker color={endColor} onChange={setEndColor} />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre de couleurs
        </label>
        <input
          type="number"
          min="2"
          max="16"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>
      
      <button
        onClick={handleGenerate}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Générer le dégradé
      </button>
    </div>
  );
};

export default GradientGenerator;