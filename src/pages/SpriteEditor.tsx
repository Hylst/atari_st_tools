import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Eraser, Move, Download, Grid as GridIcon, Trash2, Save, Copy } from 'lucide-react';
import ColorPicker from '../components/palette/ColorPicker';
import { RGB } from '../lib/palette/types';
import ExportPanel from '../components/export/ExportPanel';

const tools = [
  { id: 'pencil', name: 'Crayon', icon: Pencil },
  { id: 'eraser', name: 'Gomme', icon: Eraser },
  { id: 'move', name: 'Déplacer', icon: Move },
  { id: 'clear', name: 'Effacer', icon: Trash2 }
];

const defaultPalette: RGB[] = [
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 255, g: 255, b: 0 },
  { r: 255, g: 0, b: 255 },
  { r: 0, g: 255, b: 255 },
  { r: 128, g: 128, g: 128 },
  { r: 192, g: 192, b: 192 },
  { r: 128, g: 0, b: 0 },
  { r: 0, g: 128, b: 0 },
  { r: 0, g: 0, b: 128 },
  { r: 128, g: 128, b: 0 },
  { r: 128, g: 0, b: 128 },
  { r: 0, g: 128, b: 128 }
];

const SpriteEditor: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [selectedColor, setSelectedColor] = useState<RGB>(defaultPalette[1]);
  const [canvasScale, setCanvasScale] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [spriteWidth, setSpriteWidth] = useState(16);
  const [spriteHeight, setSpriteHeight] = useState(16);
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  
  // Initialiser le premier frame
  useEffect(() => {
    if (frames.length === 0) {
      const newFrame = new ImageData(spriteWidth, spriteHeight);
      // Remplir avec une couleur transparente (index 0)
      for (let i = 0; i < newFrame.data.length; i += 4) {
        newFrame.data[i + 3] = 255; // Alpha à 255 (opaque)
      }
      setFrames([newFrame]);
    }
  }, [frames, spriteWidth, spriteHeight]);
  
  // Mettre à jour le canvas quand le frame change
  useEffect(() => {
    if (!canvasRef.current || frames.length === 0 || currentFrame >= frames.length) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Redimensionner le canvas si nécessaire
    if (canvasRef.current.width !== spriteWidth * canvasScale || 
        canvasRef.current.height !== spriteHeight * canvasScale) {
      canvasRef.current.width = spriteWidth * canvasScale;
      canvasRef.current.height = spriteHeight * canvasScale;
    }
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Dessiner le frame actuel
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = spriteWidth;
    tempCanvas.height = spriteHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCtx.putImageData(frames[currentFrame], 0, 0);
    
    // Dessiner l'image agrandie
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      tempCanvas, 
      0, 0, spriteWidth, spriteHeight,
      0, 0, spriteWidth * canvasScale, spriteHeight * canvasScale
    );
    
    // Dessiner la grille si activée
    if (showGrid) {
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
      ctx.lineWidth = 0.5;
      
      // Lignes verticales
      for (let x = 0; x <= spriteWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * canvasScale, 0);
        ctx.lineTo(x * canvasScale, spriteHeight * canvasScale);
        ctx.stroke();
      }
      
      // Lignes horizontales
      for (let y = 0; y <= spriteHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * canvasScale);
        ctx.lineTo(spriteWidth * canvasScale, y * canvasScale);
        ctx.stroke();
      }
    }
    
    // Mettre à jour la prévisualisation
    updatePreview();
  }, [frames, currentFrame, canvasScale, showGrid, spriteWidth, spriteHeight]);
  
  const updatePreview = () => {
    if (!previewRef.current || frames.length === 0 || currentFrame >= frames.length) return;
    
    const ctx = previewRef.current.getContext('2d');
    if (!ctx) return;
    
    // Redimensionner le canvas de prévisualisation si nécessaire
    if (previewRef.current.width !== spriteWidth || previewRef.current.height !== spriteHeight) {
      previewRef.current.width = spriteWidth;
      previewRef.current.height = spriteHeight;
    }
    
    // Effacer le canvas
    ctx.clearRect(0, 0, spriteWidth, spriteHeight);
    
    // Dessiner le frame actuel
    ctx.putImageData(frames[currentFrame], 0, 0);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    setLastPos({ x, y });
    handleDraw(x, y);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const { x, y } = getCanvasCoordinates(e);
    
    // Si on a bougé d'au moins un pixel
    if (lastPos && (lastPos.x !== x || lastPos.y !== y)) {
      // Interpolation linéaire pour les traits continus
      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      
      if (steps > 1) {
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const ix = Math.round(lastPos.x + dx * t);
          const iy = Math.round(lastPos.y + dy * t);
          handleDraw(ix, iy);
        }
      } else {
        handleDraw(x, y);
      }
      
      setLastPos({ x, y });
    }
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };
  
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / canvasScale);
    const y = Math.floor((e.clientY - rect.top) / canvasScale);
    return { x: Math.max(0, Math.min(x, spriteWidth - 1)), y: Math.max(0, Math.min(y, spriteHeight - 1)) };
  };
  
  const handleDraw = (x: number, y: number) => {
    if (x < 0 || x >= spriteWidth || y < 0 || y >= spriteHeight) return;
    
    const newFrames = [...frames];
    const frameData = new Uint8ClampedArray(newFrames[currentFrame].data);
    const imageData = new ImageData(frameData, spriteWidth, spriteHeight);
    
    const index = (y * spriteWidth + x) * 4;
    
    if (selectedTool === 'pencil') {
      imageData.data[index] = selectedColor.r;
      imageData.data[index + 1] = selectedColor.g;
      imageData.data[index + 2] = selectedColor.b;
      imageData.data[index + 3] = 255; // Opaque
    } else if (selectedTool === 'eraser') {
      imageData.data[index] = 0;
      imageData.data[index + 1] = 0;
      imageData.data[index + 2] = 0;
      imageData.data[index + 3] = 0; // Transparent
    }
    
    newFrames[currentFrame] = imageData;
    setFrames(newFrames);
  };
  
  const handleClearCanvas = () => {
    if (selectedTool === 'clear') {
      const newFrames = [...frames];
      const newFrame = new ImageData(spriteWidth, spriteHeight);
      // Remplir avec une couleur transparente
      for (let i = 0; i < newFrame.data.length; i += 4) {
        newFrame.data[i + 3] = 255; // Alpha à 255 (opaque)
      }
      newFrames[currentFrame] = newFrame;
      setFrames(newFrames);
    }
  };
  
  const handleAddFrame = () => {
    // Copier le frame actuel
    const currentFrameData = new Uint8ClampedArray(frames[currentFrame].data);
    const newFrame = new ImageData(currentFrameData, spriteWidth, spriteHeight);
    
    setFrames([...frames, newFrame]);
    setCurrentFrame(frames.length);
  };
  
  const handleExport = (format: string) => {
    // Convertir les frames en données pour l'export
    const spriteData = new Uint8Array(spriteWidth * spriteHeight * frames.length);
    
    frames.forEach((frame, frameIndex) => {
      for (let y = 0; y < spriteHeight; y++) {
        for (let x = 0; x < spriteWidth; x++) {
          const srcIdx = (y * spriteWidth + x) * 4;
          const destIdx = frameIndex * spriteWidth * spriteHeight + y * spriteWidth + x;
          
          // Convertir RGB en index de couleur (simplification)
          const r = frame.data[srcIdx];
          const g = frame.data[srcIdx + 1];
          const b = frame.data[srcIdx + 2];
          
          // Trouver la couleur la plus proche dans la palette
          let bestMatch = 0;
          let bestDistance = Infinity;
          
          defaultPalette.forEach((color, index) => {
            const dr = r - color.r;
            const dg = g - color.g;
            const db = b - color.b;
            const distance = dr*dr + dg*dg + db*db;
            
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = index;
            }
          });
          
          spriteData[destIdx] = bestMatch;
        }
      }
    });
    
    return {
      name: 'sprite',
      data: spriteData,
      symbols: {
        SPRITE_WIDTH: spriteWidth,
        SPRITE_HEIGHT: spriteHeight,
        SPRITE_FRAMES: frames.length
      }
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Éditeur de Sprites</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded ${showGrid ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                  title="Afficher/Masquer la grille"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <select
                  value={canvasScale}
                  onChange={(e) => setCanvasScale(Number(e.target.value))}
                  className="border rounded px-2"
                >
                  <option value="4">4x</option>
                  <option value="8">8x</option>
                  <option value="12">12x</option>
                  <option value="16">16x</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-sm">W:</label>
                  <input
                    type="number"
                    min="8"
                    max="64"
                    value={spriteWidth}
                    onChange={(e) => setSpriteWidth(Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-sm">H:</label>
                  <input
                    type="number"
                    min="8"
                    max="64"
                    value={spriteHeight}
                    onChange={(e) => setSpriteHeight(Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded bg-gray-50 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={spriteWidth * canvasScale}
                height={spriteHeight * canvasScale}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="block"
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Animation</h3>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                  disabled={currentFrame === 0}
                  className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1">
                  Frame {currentFrame + 1} / {frames.length}
                </span>
                <button
                  onClick={() => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1))}
                  disabled={currentFrame === frames.length - 1}
                  className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <button
                onClick={handleAddFrame}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                <Copy className="w-4 h-4" />
                Ajouter un frame
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="border border-gray-200 rounded p-2 bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Aperçu</h4>
                <canvas
                  ref={previewRef}
                  width={spriteWidth}
                  height={spriteHeight}
                  className="block border border-gray-300"
                  style={{ 
                    width: `${spriteWidth * 2}px`, 
                    height: `${spriteHeight * 2}px`,
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
              
              <div className="border border-gray-200 rounded p-2 bg-gray-50 flex-1">
                <h4 className="text-sm font-medium mb-2">Aperçu animation</h4>
                <div className="flex gap-2 overflow-x-auto p-2">
                  {frames.map((frame, index) => {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = spriteWidth;
                    tempCanvas.height = spriteHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    if (tempCtx) {
                      tempCtx.putImageData(frame, 0, 0);
                    }
                    
                    return (
                      <div 
                        key={index}
                        className={`border ${index === currentFrame ? 'border-indigo-500' : 'border-gray-300'} cursor-pointer`}
                        onClick={() => setCurrentFrame(index)}
                      >
                        <canvas
                          width={spriteWidth}
                          height={spriteHeight}
                          className="block"
                          style={{ 
                            width: `${spriteWidth}px`, 
                            height: `${spriteHeight}px`,
                            imageRendering: 'pixelated'
                          }}
                          ref={canvas => {
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.putImageData(frame, 0, 0);
                              }
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Outils</h3>
            <div className="grid grid-cols-4 gap-2">
              {tools.map(tool => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool.id);
                      if (tool.id === 'clear') {
                        handleClearCanvas();
                      }
                    }}
                    className={`flex flex-col items-center gap-2 p-2 rounded ${
                      selectedTool === tool.id && tool.id !== 'clear'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-50'
                    }`}
                    title={tool.name}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Couleurs</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {defaultPalette.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded border-2 ${
                    selectedColor.r === color.r && 
                    selectedColor.g === color.g && 
                    selectedColor.b === color.b 
                      ? 'border-indigo-500 scale-110' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: `rgb(${color.r},${color.g},${color.b})` }}
                />
              ))}
            </div>
            
            <ColorPicker color={selectedColor} onChange={setSelectedColor} />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Export</h3>
            <ExportPanel
              options={{
                name: 'sprite',
                data: new Uint8Array(spriteWidth * spriteHeight * frames.length),
                symbols: {
                  SPRITE_WIDTH: spriteWidth,
                  SPRITE_HEIGHT: spriteHeight,
                  SPRITE_FRAMES: frames.length
                }
              }}
              onExport={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpriteEditor;