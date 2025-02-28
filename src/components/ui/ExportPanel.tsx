import React from 'react';
import { Download } from 'lucide-react';

interface ExportPanelProps {
  formats: { value: string; label: string }[];
  onExport: (format: string) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ formats, onExport }) => {
  const [selectedFormat, setSelectedFormat] = React.useState(formats[0]?.value);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Exporter</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">
            Format
          </label>
          <select
            id="format"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onExport(selectedFormat)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;