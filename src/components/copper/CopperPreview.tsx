import React, { useEffect, useRef } from 'react';
import { CopperList } from '../../lib/copper/types';
import { simulateCopperList } from '../../lib/copper/generator';

interface CopperPreviewProps {
  copperList: CopperList;
  width?: number;
  height?: number;
}

const CopperPreview: React.FC<CopperPreviewProps> = ({ 
  copperList, 
  width = 320, 
  height = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simuler l'exécution de la liste copper
    const imageData = simulateCopperList(copperList);
    
    // Créer une ImageData et l'afficher
    const image = new ImageData(new Uint8ClampedArray(imageData), 320, 200);
    ctx.putImageData(image, 0, 0);
    
    // Dessiner les lignes de scanline (optionnel, pour visualisation)
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#ffffff';
    for (let y = 0; y < 200; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(320, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
    
    // Marquer les positions des instructions copper
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const uniqueScanlines = [...new Set(copperList.instructions.map(inst => inst.scanline))];
    uniqueScanlines.forEach(line => {
      ctx.fillRect(0, line, 5, 1);
    });
    
  }, [copperList]);
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        className="w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
        {copperList.instructions.length} instructions
      </div>
    </div>
  );
};

export default CopperPreview;