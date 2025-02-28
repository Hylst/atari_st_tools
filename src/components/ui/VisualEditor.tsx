import React, { useState } from 'react';
import Canvas from './Canvas';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface VisualEditorProps {
  width: number;
  height: number;
  tools: Tool[];
  onDraw?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ width, height, tools, onDraw }) => {
  const [selectedTool, setSelectedTool] = useState(tools[0]?.id);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (onDraw) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDraw(e.currentTarget.getContext('2d')!, x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !onDraw) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDraw(e.currentTarget.getContext('2d')!, x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`p-2 rounded ${
              selectedTool === tool.id ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
            }`}
            title={tool.name}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      <Canvas
        width={width}
        height={height}
        className="border border-gray-200 rounded cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default VisualEditor;