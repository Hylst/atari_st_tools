import React, { useState, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import ImagePreview from '../ui/ImagePreview';
import { PI1Image } from '../../lib/image/types';

const PI1Converter: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const [convertedImage, setConvertedImage] = useState<PI1Image | null>(null);

  const handleImageLoad = useCallback((imageData: ImageData) => {
    setSourceImage(imageData);
    
    // Create Web Worker for conversion
    const worker = new Worker(
      new URL('../../lib/image/pi1.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    worker.onmessage = (e) => {
      setConvertedImage(e.data);
      worker.terminate();
    };
    
    worker.postMessage({
      imageData: imageData.data,
      width: imageData.width,
      height: imageData.height
    });
  }, []);

  return (
    <div className="space-y-6">
      <ImageUpload onImageLoad={handleImageLoad} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sourceImage && (
          <div>
            <h3 className="text-lg font-medium mb-2">Image source</h3>
            <ImagePreview
              width={sourceImage.width}
              height={sourceImage.height}
              data={sourceImage}
            />
          </div>
        )}
        
        {convertedImage && (
          <div>
            <h3 className="text-lg font-medium mb-2">Image convertie (PI1)</h3>
            <ImagePreview
              width={convertedImage.width}
              height={convertedImage.height}
              data={convertedImage.data}
              palette={convertedImage.header.palette}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PI1Converter;