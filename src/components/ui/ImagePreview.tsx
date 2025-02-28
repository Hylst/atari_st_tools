import React, { useRef, useEffect } from 'react';

interface ImagePreviewProps {
  data: ImageData;
  width: number;
  height: number;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  data, 
  width, 
  height, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille réelle du canvas
    canvas.width = width;
    canvas.height = height;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Créer une nouvelle ImageData avec les bonnes dimensions
    const imageData = new ImageData(
      new Uint8ClampedArray(data.data),
      width,
      height
    );

    // Dessiner les données de l'image
    ctx.putImageData(imageData, 0, 0);
  }, [data, width, height]);

  return (
    <div className={`${className} relative bg-white rounded-lg shadow-sm border border-gray-200`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-auto"
        style={{ 
          imageRendering: 'pixelated',
          aspectRatio: `${width}/${height}` 
        }}
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {width}x{height}
      </div>
    </div>
  );
};

export default ImagePreview;