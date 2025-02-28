import React from 'react';
import { visualizeRasterTiming } from '../../lib/analysis/raster/visualizer';
import { RasterTiming } from '../../lib/analysis/raster/timing';

interface RasterVisualizerProps {
  timing: RasterTiming;
  totalCycles: number;
}

const RasterVisualizer: React.FC<RasterVisualizerProps> = ({ timing, totalCycles }) => {
  const scanlines = visualizeRasterTiming(timing);
  
  // Calculate where the code execution would end
  const codeEndPosition = (totalCycles / timing.frameTime) * 100;
  
  return (
    <div className="space-y-2">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Visualisation Raster</h3>
        
        <div className="h-40 relative border rounded bg-gray-50">
          {scanlines.map((line, i) => (
            <div
              key={i}
              className={`absolute h-0.5 left-0 right-0 ${
                line.isVBL ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={{ top: `${(i / 200) * 100}%` }}
            />
          ))}
          
          {/* VBL Start Line */}
          <div 
            className="absolute w-0.5 bg-blue-500 h-full"
            style={{
              left: `${(timing.vblStart / timing.frameTime) * 100}%`
            }}
          />
          
          {/* Code Execution */}
          <div 
            className={`absolute h-full ${codeEndPosition > 100 ? 'bg-red-200' : 'bg-green-200'}`}
            style={{
              left: 0,
              width: `${Math.min(codeEndPosition, 100)}%`,
              opacity: 0.5
            }}
          />
          
          {/* Code End Marker */}
          {codeEndPosition <= 100 && (
            <div 
              className="absolute w-0.5 bg-green-600 h-full"
              style={{
                left: `${codeEndPosition}%`
              }}
            />
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-500 flex justify-between">
          <span>0</span>
          <span>{timing.frameTime} cycles</span>
        </div>
        
        <div className="mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500"></div>
            <span>Intervalle VBL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200"></div>
            <span>Exécution du code</span>
          </div>
          {codeEndPosition > 100 && (
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <div className="w-3 h-3 bg-red-200"></div>
              <span>Dépassement de frame!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RasterVisualizer;