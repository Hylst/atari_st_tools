import React, { useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { ExportFormat, ExportOptions, ExportResult } from '../../lib/export/types';
import { getExportFormats, exportData } from '../../lib/export';

interface ExportPanelProps {
  options: ExportOptions;
  onExport?: (result: ExportResult) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ options, onExport }) => {
  const [format, setFormat] = useState<string>(getExportFormats()[0].id);
  const [errors, setErrors] = useState<string[]>([]);
  const formats = getExportFormats();

  const handleExport = () => {
    if (!options || !options.data) {
      setErrors(['Données d\'export manquantes']);
      return;
    }
    
    const result = exportData(format, options);
    setErrors(result.errors);
    
    if (result.errors.length === 0) {
      // Create and download file
      const exporter = formats.find(f => f.id === format)!;
      const blob = new Blob(
        [result.content],
        { type: format === 'bin' ? 'application/octet-stream' : 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.name}.${exporter.extension}`;
      a.click();
      URL.revokeObjectURL(url);
      
      if (onExport) onExport(result);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Format d'export
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {formats.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreurs de validation
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <Download className="w-4 h-4" />
        Exporter
      </button>
    </div>
  );
};

export default ExportPanel;