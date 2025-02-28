import React, { useState, useCallback } from 'react';
import ParameterForm from '../ui/ParameterForm';
import ExportPanel from '../ui/ExportPanel';
import CurvePreview from './CurvePreview';
import { 
  generateSine, 
  generateCircle, 
  generateSpiral,
  generateLissajous,
  generateRose,
  generateEpicycloid
} from '../../lib/curves/generators';
import { exportToASM, exportToC, exportToJSON } from '../../lib/curves/export';
import { CurveParameters, Point } from '../../lib/curves/types';

const curveTypes = [
  { value: 'sine', label: 'Sinusoïde' },
  { value: 'circle', label: 'Cercle' },
  { value: 'spiral', label: 'Spirale' },
  { value: 'lissajous', label: 'Lissajous' },
  { value: 'rose', label: 'Rose' },
  { value: 'epicycloid', label: 'Épicycloïde' }
];

const exportFormats = [
  { value: 'asm', label: 'Assembleur' },
  { value: 'c', label: 'C' },
  { value: 'json', label: 'JSON' }
];

const CurveGenerator: React.FC = () => {
  const [parameters, setParameters] = useState<CurveParameters>({
    type: 'sine',
    amplitude: 100,
    frequency: 1,
    phase: 0,
    steps: 100,
    radius: 100,
    loops: 3,
    petals: 5,
    R: 100,
    r: 30
  });

  const [points, setPoints] = useState<Point[]>([]);

  const generateCurve = useCallback(() => {
    let newPoints: Point[] = [];
    switch (parameters.type) {
      case 'sine':
        newPoints = generateSine(parameters);
        break;
      case 'circle':
        newPoints = generateCircle(parameters);
        break;
      case 'spiral':
        newPoints = generateSpiral(parameters);
        break;
      case 'lissajous':
        newPoints = generateLissajous(parameters);
        break;
      case 'rose':
        newPoints = generateRose(parameters);
        break;
      case 'epicycloid':
        newPoints = generateEpicycloid(parameters);
        break;
    }
    setPoints(newPoints);
  }, [parameters]);

  const handleExport = useCallback((format: string) => {
    let content = '';
    switch (format) {
      case 'asm':
        content = exportToASM(points);
        break;
      case 'c':
        content = exportToC(points);
        break;
      case 'json':
        content = exportToJSON(points);
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curve.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [points]);

  const getParameters = () => {
    const baseParams = [
      {
        id: 'type',
        label: 'Type de courbe',
        type: 'select' as const,
        value: parameters.type,
        options: curveTypes,
        onChange: (value) => setParameters({ ...parameters, type: value as string }),
      },
      {
        id: 'steps',
        label: 'Nombre de points',
        type: 'number' as const,
        value: parameters.steps || 100,
        onChange: (value) => setParameters({ ...parameters, steps: value as number }),
      },
    ];

    switch (parameters.type) {
      case 'sine':
        return [
          ...baseParams,
          {
            id: 'amplitude',
            label: 'Amplitude',
            type: 'number' as const,
            value: parameters.amplitude || 100,
            onChange: (value) => setParameters({ ...parameters, amplitude: value as number }),
          },
          {
            id: 'frequency',
            label: 'Fréquence',
            type: 'number' as const,
            value: parameters.frequency || 1,
            onChange: (value) => setParameters({ ...parameters, frequency: value as number }),
          },
          {
            id: 'phase',
            label: 'Phase',
            type: 'number' as const,
            value: parameters.phase || 0,
            onChange: (value) => setParameters({ ...parameters, phase: value as number }),
          },
        ];
      case 'circle':
        return [
          ...baseParams,
          {
            id: 'radius',
            label: 'Rayon',
            type: 'number' as const,
            value: parameters.radius || 100,
            onChange: (value) => setParameters({ ...parameters, radius: value as number }),
          },
        ];
      case 'spiral':
        return [
          ...baseParams,
          {
            id: 'radius',
            label: 'Rayon maximum',
            type: 'number' as const,
            value: parameters.radius || 100,
            onChange: (value) => setParameters({ ...parameters, radius: value as number }),
          },
          {
            id: 'loops',
            label: 'Nombre de boucles',
            type: 'number' as const,
            value: parameters.loops || 3,
            onChange: (value) => setParameters({ ...parameters, loops: value as number }),
          },
        ];
      case 'lissajous':
        return [
          ...baseParams,
          {
            id: 'amplitude',
            label: 'Amplitude',
            type: 'number' as const,
            value: parameters.amplitude || 100,
            onChange: (value) => setParameters({ ...parameters, amplitude: value as number }),
          },
          {
            id: 'frequency',
            label: 'Fréquence',
            type: 'number' as const,
            value: parameters.frequency || 1,
            onChange: (value) => setParameters({ ...parameters, frequency: value as number }),
          },
        ];
      case 'rose':
        return [
          ...baseParams,
          {
            id: 'radius',
            label: 'Rayon',
            type: 'number' as const,
            value: parameters.radius || 100,
            onChange: (value) => setParameters({ ...parameters, radius: value as number }),
          },
          {
            id: 'petals',
            label: 'Nombre de pétales',
            type: 'number' as const,
            value: parameters.petals || 5,
            onChange: (value) => setParameters({ ...parameters, petals: value as number }),
          },
        ];
      case 'epicycloid':
        return [
          ...baseParams,
          {
            id: 'R',
            label: 'Rayon cercle fixe',
            type: 'number' as const,
            value: parameters.R || 100,
            onChange: (value) => setParameters({ ...parameters, R: value as number }),
          },
          {
            id: 'r',
            label: 'Rayon cercle mobile',
            type: 'number' as const,
            value: parameters.r || 30,
            onChange: (value) => setParameters({ ...parameters, r: value as number }),
          },
        ];
      default:
        return baseParams;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CurvePreview points={points} />
      </div>
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Paramètres</h3>
          <ParameterForm
            parameters={getParameters()}
            onSubmit={generateCurve}
          />
        </div>
        <ExportPanel
          formats={exportFormats}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default CurveGenerator;