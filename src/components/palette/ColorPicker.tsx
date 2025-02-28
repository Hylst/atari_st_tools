import React from 'react';
import { RGB } from '../../lib/palette/types';

interface ColorPickerProps {
  color: RGB;
  onChange: (color: RGB) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: `rgb(${color.r},${color.g},${color.b})` }}
        />
        <span className="text-sm text-gray-600">
          RGB({color.r}, {color.g}, {color.b})
        </span>
      </div>
      
      {['r', 'g', 'b'].map((channel) => (
        <div key={channel} className="flex items-center gap-2">
          <label className="w-6 text-gray-600 uppercase">{channel}</label>
          <input
            type="range"
            min="0"
            max="255"
            value={color[channel as keyof RGB]}
            onChange={(e) => onChange({ ...color, [channel]: parseInt(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={color[channel as keyof RGB]}
            onChange={(e) => onChange({ ...color, [channel]: parseInt(e.target.value) })}
            className="w-16 px-2 py-1 border rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;