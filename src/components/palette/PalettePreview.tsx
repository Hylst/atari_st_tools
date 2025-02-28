import React from 'react';
import { RGB } from '../../lib/palette/types';

interface PalettePreviewProps {
  colors: RGB[];
  selectedIndex?: number;
  onSelectColor?: (index: number) => void;
}

const PalettePreview: React.FC<PalettePreviewProps> = ({
  colors,
  selectedIndex,
  onSelectColor
}) => {
  return (
    <div className="grid grid-cols-8 gap-1">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onSelectColor?.(index)}
          className={`
            aspect-square rounded border-2 transition-all
            ${selectedIndex === index ? 'border-indigo-500 scale-110' : 'border-transparent hover:border-gray-300'}
          `}
          style={{
            backgroundColor: `rgb(${color.r},${color.g},${color.b})`
          }}
          title={`Couleur ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PalettePreview;