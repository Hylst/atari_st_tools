import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  onDraw?: (ctx: CanvasRenderingContext2D) => void;
  className?: string;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, onDraw, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual size in memory
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Call custom draw function
    if (onDraw) {
      onDraw(ctx);
    }
  }, [width, height, onDraw]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className} block`}
      style={{ width, height }}
    />
  );
};

export default Canvas;