import React, { useState, useRef } from 'react';
import { Download, Upload, Palette as PaletteIcon, Image, Settings, Info } from 'lucide-react';
import ImageUpload from '../components/converter/ImageUpload';
import ImagePreview from '../components/ui/ImagePreview';
import { PI1Image } from '../lib/image/types';
import { RGB } from '../lib/palette/types';
import ColorPicker from '../components/palette/ColorPicker';
import PalettePreview from '../components/palette/PalettePreview';
import { exportPalette } from '../lib/palette/utils';

const Converter: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const [convertedImage, setConvertedImage] = useState<PI1Image | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'image' | 'palette'>('image');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [ditherLevel, setDitherLevel] = useState<number>(0);
  const [optimizePalette, setOptimizePalette] = useState<boolean>(true);
  const [conversionMode, setConversionMode] = useState<'auto' | 'manual'>('auto');
  const [customPalette, setCustomPalette] = useState<RGB[]>([]);
  const [useCustomPalette, setUseCustomPalette] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = (imageData: ImageData, name: string) => {
    setSourceImage(imageData);
    setFileName(name);
    
    // Si c'est un fichier PI1, on l'a déjà converti dans le composant ImageUpload
    if (name.toLowerCase().endsWith('.pi1')) {
      // Créer Web Worker pour extraire la palette et les données
      const worker = new Worker(
        new URL('../lib/image/pi1.worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      worker.onmessage = (e) => {
        setConvertedImage(e.data);
        setCustomPalette(e.data.header.palette);
        worker.terminate();
      };
      
      worker.postMessage({
        imageData: Array.from(imageData.data),
        width: imageData.width,
        height: imageData.height,
        fromPI1: true
      });
    } else {
      // Créer Web Worker pour la conversion
      const worker = new Worker(
        new URL('../lib/image/pi1.worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      worker.onmessage = (e) => {
        setConvertedImage(e.data);
        setCustomPalette(e.data.header.palette);
        worker.terminate();
      };
      
      worker.postMessage({
        imageData: Array.from(imageData.data),
        width: imageData.width,
        height: imageData.height,
        ditherLevel,
        optimizePalette,
        customPalette: useCustomPalette ? customPalette : undefined
      });
    }
  };

  const handleConvert = () => {
    if (!sourceImage) return;
    
    // Créer Web Worker pour la conversion
    const worker = new Worker(
      new URL('../lib/image/pi1.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    worker.onmessage = (e) => {
      setConvertedImage(e.data);
      worker.terminate();
    };
    
    worker.postMessage({
      imageData: Array.from(sourceImage.data),
      width: sourceImage.width,
      height: sourceImage.height,
      ditherLevel,
      optimizePalette,
      customPalette: useCustomPalette ? customPalette : undefined
    });
  };

  const handleExportPI1 = () => {
    if (!convertedImage) return;
    
    const blob = new Blob([convertedImage.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + '.pi1';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    if (!convertedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Définir la taille du canvas
    canvas.width = convertedImage.width;
    canvas.height = convertedImage.height;
    
    // Dessiner l'image convertie
    ctx.putImageData(convertedImage.imageData, 0, 0);
    
    // Exporter en PNG
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.[^/.]+$/, '') + '.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleExportPalette = (format: 'bin' | 'asm' | 'gfa') => {
    if (!convertedImage) return;
    
    const palette = convertedImage.header.palette;
    const paletteData = exportPalette(palette);
    
    let content: string | Uint8Array = paletteData;
    let mimeType = 'application/octet-stream';
    let extension = 'pal';
    
    if (format === 'asm') {
      // Format assembleur
      const lines = ['; Palette Atari ST', ''];
      lines.push('palette:');
      
      for (let i = 0; i < 16; i++) {
        const color = palette[i];
        const r = Math.round(color.r / 255 * 7);
        const g = Math.round(color.g / 255 * 7);
        const b = Math.round(color.b / 255 * 7);
        const value = (r << 8) | (g << 4) | b;
        
        lines.push(`\tdc.w\t$${value.toString(16).padStart(4, '0')}\t; Couleur ${i}`);
      }
      
      content = lines.join('\n');
      mimeType = 'text/plain';
      extension = 's';
    } else if (format === 'gfa') {
      // Format GFA BASIC
      const lines = ['REM Palette Atari ST', ''];
      lines.push('DATA 16 REM Nombre de couleurs');
      
      const values: number[] = [];
      for (let i = 0; i < 16; i++) {
        const color = palette[i];
        const r = Math.round(color.r / 255 * 7);
        const g = Math.round(color.g / 255 * 7);
        const b = Math.round(color.b / 255 * 7);
        const value = (r << 8) | (g << 4) | b;
        values.push(value);
      }
      
      // Grouper par 8 valeurs par ligne
      for (let i = 0; i < values.length; i += 8) {
        const chunk = values.slice(i, Math.min(i + 8, values.length));
        lines.push(`DATA ${chunk.join(',')}`);
      }
      
      content = lines.join('\n');
      mimeType = 'text/plain';
      extension = 'bas';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + '.' + extension;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (color: RGB) => {
    if (!convertedImage || selectedColorIndex === null) return;
    
    const newPalette = [...convertedImage.header.palette];
    newPalette[selectedColorIndex] = color;
    
    setCustomPalette(newPalette);
    setUseCustomPalette(true);
    
    // Mettre à jour l'image avec la nouvelle palette
    if (conversionMode === 'manual') {
      handleConvert();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Convertisseur PI1</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <Info className="w-6 h-6 text-blue-400 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Format PI1 (DEGAS Elite)</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Format d'image natif de l'Atari ST :</p>
                <div className="mt-2 ml-4">
                  <ul className="list-disc space-y-1">
                    <li>Résolution : 320×200 pixels</li>
                    <li>16 couleurs (4 bits par pixel)</li>
                    <li>Taille fixe : 32034 octets</li>
                    <li>Structure :
                      <ul className="ml-4 mt-1 list-disc">
                        <li>En-tête (34 octets) : ID + palette</li>
                        <li>Données (32000 octets) : 4 bitplanes</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${selectedTab === 'image' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('image')}
          >
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Image
            </div>
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 'palette' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('palette')}
          >
            <div className="flex items-center gap-2">
              <PaletteIcon className="w-5 h-5" />
              Palette
            </div>
          </button>
        </div>
      </div>
      
      {selectedTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Image source</h3>
              <ImageUpload onImageLoad={handleImageLoad} />
              {sourceImage && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Fichier : {fileName}</p>
                    <p>Dimensions : {sourceImage.width}×{sourceImage.height} pixels</p>
                    <p>Format : {fileName.split('.').pop()?.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>
            
            {sourceImage && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">Aperçu source</h3>
                <ImagePreview
                  width={sourceImage.width}
                  height={sourceImage.height}
                  data={sourceImage}
                />
              </div>
            )}
            
            {sourceImage && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Options de conversion
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={optimizePalette}
                        onChange={(e) => setOptimizePalette(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>Optimiser la palette</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useCustomPalette}
                        onChange={(e) => setUseCustomPalette(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>Utiliser palette personnalisée</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau de dithering
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={ditherLevel}
                        onChange={(e) => setDitherLevel(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 w-8 text-center">{ditherLevel}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConvert}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Convertir
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {convertedImage && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">Image convertie (PI1)</h3>
                <ImagePreview
                  width={convertedImage.width}
                  height={convertedImage.height}
                  data={convertedImage.imageData}
                />
                
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Format : PI1 (Degas Elite)</p>
                    <p>Dimensions : 320×200 pixels</p>
                    <p>Taille : 32034 octets</p>
                    <p>Palette : 16 couleurs</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportPI1}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      <Download className="w-4 h-4" />
                      Exporter PI1
                    </button>
                    
                    <button
                      onClick={handleExportPNG}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4" />
                      Exporter PNG
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">Palette</h3>
                <PalettePreview
                  colors={convertedImage.header.palette}
                  selectedIndex={selectedColorIndex}
                  onSelectColor={setSelectedColorIndex}
                />
                
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium text-sm">Exporter la palette</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportPalette('bin')}
                      className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    >
                      Binaire
                    </button>
                    <button
                      onClick={() => handleExportPalette('asm')}
                      className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    >
                      Assembleur
                    </button>
                    <button
                      onClick={() => handleExportPalette('gfa')}
                      className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    >
                      GFA BASIC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {selectedTab === 'palette' && convertedImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Palette de l'image</h3>
            <PalettePreview
              colors={convertedImage.header.palette}
              selectedIndex={selectedColorIndex}
              onSelectColor={setSelectedColorIndex}
            />
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Éditer la couleur</h4>
              <ColorPicker
                color={convertedImage.header.palette[selectedColorIndex]}
                onChange={handleColorChange}
              />
              
              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="conversionMode"
                    checked={conversionMode === 'auto'}
                    onChange={() => setConversionMode('auto')}
                    className="text-indigo-600"
                  />
                  <span>Appliquer lors de la conversion</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name="conversionMode"
                    checked={conversionMode === 'manual'}
                    onChange={() => setConversionMode('manual')}
                    className="text-indigo-600"
                  />
                  <span>Appliquer immédiatement</span>
                </label>
              </div>
              
              {conversionMode === 'auto' && (
                <button
                  onClick={handleConvert}
                  className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Appliquer les changements
                </button>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Exporter la palette</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportPalette('bin')}
                  className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Binaire
                </button>
                <button
                  onClick={() => handleExportPalette('asm')}
                  className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Assembleur
                </button>
                <button
                  onClick={() => handleExportPalette('gfa')}
                  className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  GFA BASIC
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Aperçu avec la palette actuelle</h3>
            <ImagePreview
              width={convertedImage.width}
              height={convertedImage.height}
              data={convertedImage.imageData}
            />
            
            <div className="mt-4 space-y-4">
              <div className="text-sm text-gray-600 space-y-1">
                <p>Format : PI1 (Degas Elite)</p>
                <p>Dimensions : 320×200 pixels</p>
                <p>Palette : 16 couleurs (4 bits par pixel)</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleExportPI1}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  Exporter PI1
                </button>
                
                <button
                  onClick={handleExportPNG}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <Download className="w-4 h-4" />
                  Exporter PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Canvas caché pour l'export PNG */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Converter;