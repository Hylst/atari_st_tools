import React, { useState, useCallback } from 'react';
import { Box, Disc, Cylinder } from 'lucide-react';
import Viewport3D from '../components/3d/Viewport3D';
import { createCube } from '../lib/3d/primitives/cube';
import { createSphere } from '../lib/3d/primitives/sphere';
import { createCylinder } from '../lib/3d/primitives/cylinder';
import { Mesh } from '../lib/3d/types';
import ExportPanel from '../components/export/ExportPanel';
import { optimizeMesh } from '../lib/3d/export/atari';

const primitives = [
  { id: 'cube', name: 'Cube', icon: Box },
  { id: 'sphere', name: 'Sphère', icon: Disc },
  { id: 'cylinder', name: 'Cylindre', icon: Cylinder }
];

const Generator3D: React.FC = () => {
  const [mesh, setMesh] = useState<Mesh>(createCube());
  const [selectedPrimitive, setSelectedPrimitive] = useState('cube');
  const [parameters, setParameters] = useState({
    radius: 1,
    height: 2,
    segments: 32
  });
  
  const generateMesh = useCallback(() => {
    switch (selectedPrimitive) {
      case 'cube':
        setMesh(createCube());
        break;
      case 'sphere':
        setMesh(createSphere(parameters.radius, parameters.segments));
        break;
      case 'cylinder':
        setMesh(createCylinder(parameters.radius, parameters.height, parameters.segments));
        break;
    }
  }, [selectedPrimitive, parameters]);
  
  const handleExport = useCallback((format: string) => {
    const optimized = optimizeMesh(mesh);
    const content = JSON.stringify(optimized);
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [mesh]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Générateur 3D</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Viewport3D mesh={mesh} width={600} height={400} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Primitives</h3>
            <div className="grid grid-cols-3 gap-2">
              {primitives.map(primitive => {
                const Icon = primitive.icon;
                return (
                  <button
                    key={primitive.id}
                    onClick={() => {
                      setSelectedPrimitive(primitive.id);
                      generateMesh();
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded transition-colors ${
                      selectedPrimitive === primitive.id 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="text-sm">{primitive.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {selectedPrimitive !== 'cube' && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Paramètres</h3>
              <div className="space-y-4">
                {selectedPrimitive === 'sphere' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rayon
                      </label>
                      <input
                        type="number"
                        value={parameters.radius}
                        onChange={(e) => setParameters({
                          ...parameters,
                          radius: parseFloat(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Segments
                      </label>
                      <input
                        type="number"
                        value={parameters.segments}
                        onChange={(e) => setParameters({
                          ...parameters,
                          segments: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </>
                )}
                
                {selectedPrimitive === 'cylinder' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rayon
                      </label>
                      <input
                        type="number"
                        value={parameters.radius}
                        onChange={(e) => setParameters({
                          ...parameters,
                          radius: parseFloat(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hauteur
                      </label>
                      <input
                        type="number"
                        value={parameters.height}
                        onChange={(e) => setParameters({
                          ...parameters,
                          height: parseFloat(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Segments
                      </label>
                      <input
                        type="number"
                        value={parameters.segments}
                        onChange={(e) => setParameters({
                          ...parameters,
                          segments: parseInt(e.target.value)
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </>
                )}
                
                <button
                  onClick={generateMesh}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Générer
                </button>
              </div>
            </div>
          )}
          
          <ExportPanel
            formats={[
              { value: 'asm', label: 'Assembleur' },
              { value: 'c', label: 'C' },
              { value: 'json', label: 'JSON' }
            ]}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
};

export default Generator3D;