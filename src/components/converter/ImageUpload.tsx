import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageLoad: (imageData: ImageData, fileName: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageLoad }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Si c'est un fichier PI1
    if (file.name.toLowerCase().endsWith('.pi1')) {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      
      // Créer une ImageData à partir du fichier PI1
      const imageData = new ImageData(320, 200);
      const pixels = new Uint8ClampedArray(320 * 200 * 4);
      
      // Extraire la palette
      const palette = [];
      for (let i = 0; i < 16; i++) {
        const value = (data[2 + i * 2] << 8) | data[2 + i * 2 + 1];
        palette.push({
          r: ((value >> 8) & 0x7) * 255 / 7,
          g: ((value >> 4) & 0x7) * 255 / 7,
          b: (value & 0x7) * 255 / 7
        });
      }
      
      // Convertir les bitplanes en pixels
      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 320; x++) {
          let color = 0;
          const byteOffset = Math.floor(x / 8);
          const bitOffset = 7 - (x % 8);
          
          for (let plane = 0; plane < 4; plane++) {
            const planeOffset = 34 + plane * 8000;
            if (data[planeOffset + y * 40 + byteOffset] & (1 << bitOffset)) {
              color |= 1 << plane;
            }
          }
          
          const idx = (y * 320 + x) * 4;
          pixels[idx] = palette[color].r;
          pixels[idx + 1] = palette[color].g;
          pixels[idx + 2] = palette[color].b;
          pixels[idx + 3] = 255;
        }
      }
      
      imageData.data.set(pixels);
      onImageLoad(imageData, file.name);
    } 
    // Si c'est une image standard (PNG, JPG)
    else {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Redimensionner à 320x200 si nécessaire
        let width = img.width;
        let height = img.height;
        
        if (width > 320 || height > 200) {
          const ratio = Math.min(320 / width, 200 / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        onImageLoad(ctx.getImageData(0, 0, width, height), file.name);
      };
      img.src = URL.createObjectURL(file);
    }
  }, [onImageLoad]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/octet-stream': ['.pi1']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Upload className="w-8 h-8 text-gray-400" />
        {isDragActive ? (
          <p className="text-indigo-600">Déposez l'image ici...</p>
        ) : (
          <>
            <p className="text-gray-600">Glissez une image ou cliquez pour sélectionner</p>
            <p className="text-sm text-gray-500">PNG, JPG ou PI1</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;