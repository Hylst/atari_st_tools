import React, { useState } from 'react';
import Viewport3D from '../components/3d/Viewport3D';
import { createCube } from '../lib/3d/primitives/cube';
import { Mesh } from '../lib/3d/types';
import ExportPanel from '../components/export/ExportPanel';
import { optimizeMesh } from '../lib/3d/export/atari';

const primitives = [
  { id: 'cube', name: 'Cube' },
  { id: 'sphere', name: 'Sphère' },
  { id: 'cylinder', name: 'Cylindre' }
];

const Generator3D: React.FC = () => {
  const [mesh, setMesh] = useState<Mesh>(createCube());
  
  const handleExport = () => {
    const optimized = optimizeMesh(mesh);
    // Export optimized mesh...
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Générateur 3D</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Viewport3D mesh={mesh} width={600} height={400} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Primitives</h3>
            <div className="space-y-2">
              {primitives.map(primitive => (
                <button
                  key={primitive.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded"
                >
                  {primitive.name}
                </button>
              ))}
            </div>
          </div>
          
          <ExportPanel
            options={{
              name: '3d_object',
              data: new Uint8Array()
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Generator3D;