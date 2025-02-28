import React, { useCallback } from 'react';
import Canvas from '../ui/Canvas';
import { Point } from '../../lib/curves/types';

interface CurvePreviewProps {
  points: Point[];
  width?: number;
  height?: number;
}

const CurvePreview: React.FC<CurvePreviewProps> = ({ points, width = 400, height = 400 }) => {
  const drawCurve = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  }, [points, width, height]);

  return (
    <Canvas
      width={width}
      height={height}
      onDraw={drawCurve}
      className="bg-white rounded-lg shadow-sm"
    />
  );
};

export default CurvePreview;