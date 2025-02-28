import React, { useState, useCallback } from 'react';
import { Pencil, Eraser, Crop, Download } from 'lucide-react';
import VisualEditor from '../ui/VisualEditor';
import { Sprite } from '../../lib/image/types';

const tools = [
  { id: 'pencil', name: 'Crayon', icon: <Pencil className="w-5 h-5" /> },
  { id: 'eraser', name: 'Gomme', icon: <Eraser className="w-5 h-5" /> },
  { id: 'select', name: 'Sélection', icon: <Crop className="w-5 h-5" /> },
  { id: 'export', name: 'Exporter', icon: <Download className="w-5 h-5" /> }
];

const SpriteEditor: React.FC = () => {
  const [sprite, setSprite] = useState<Sprite | null>(null);
  const [selection, setSelection] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const handleDraw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Drawing logic here
  }, []);

  const handleExport = useCallback(() => {
    if (!sprite) return;

    const worker = new Worker(
      new URL('../../lib/image/sprite.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e) => {
      const { sprite: exportedSprite, mask } = e.data;
      // Handle export...
      worker.terminate();
    };

    worker.postMessage({
      sprite,
      generateMask: true
    });
  }, [sprite]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <VisualEditor
          width={320}
          height={200}
          tools={tools}
          onDraw={handleDraw}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Outils</h3>
        {/* Tool options */}
      </div>
    </div>
  );
};

export default SpriteEditor;