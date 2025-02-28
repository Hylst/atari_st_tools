import React, { useRef, useEffect, useState } from 'react';
import { WebGLRenderer } from '../../lib/3d/renderer/webgl';
import { Mesh, Camera } from '../../lib/3d/types';
import { createProjectionMatrix } from '../../lib/3d/math/matrices';

interface Viewport3DProps {
  mesh?: Mesh;
  width?: number;
  height?: number;
}

const Viewport3D: React.FC<Viewport3DProps> = ({ 
  mesh,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer>();
  const [error, setError] = useState<string>();
  
  useEffect(() => {
    if (!canvasRef.current || !mesh) return;
    
    try {
      // Initialiser le renderer
      if (!rendererRef.current) {
        rendererRef.current = new WebGLRenderer(canvasRef.current);
      }
      
      // Configurer la caméra avec une meilleure vue
      const camera = {
        position: {x: 3, y: 3, z: 5}, // Position plus éloignée et en angle
        target: {x: 0, y: 0, z: 0},
        up: {x: 0, y: 1, z: 0},
        fov: Math.PI / 3, // Champ de vision plus large
        aspect: width / height,
        near: 0.1,
        far: 1000,
        projectionMatrix: createProjectionMatrix(Math.PI / 3, width / height, 0.1, 1000),
        modelViewMatrix: {
          m: [
            0.7071, 0, -0.7071, 0,
            -0.4082, 0.8165, -0.4082, 0,
            0.5774, 0.5774, 0.5774, -8,
            0, 0, 0, 1
          ]
        }
      };
      
      // Rendu
      rendererRef.current.render(mesh, camera);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de rendu');
      console.error(err);
    }
  }, [mesh, width, height]);
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Viewport3D;