import React, { useState, useCallback } from 'react';
import { Preset, PresetCategory } from '../../lib/presets/types';
import { LocalPresetStorage } from '../../lib/presets/storage/local';
import { validatePreset } from '../../lib/presets/validation';
import { Search, Tag, Save, Trash2 } from 'lucide-react';

interface PresetManagerProps {
  category: PresetCategory;
  onSelect: (preset: Preset) => void;
  onSave: (data: unknown) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  category,
  onSelect,
  onSave
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [search, setSearch] = useState('');
  const storage = new LocalPresetStorage();

  const loadPresets = useCallback(async () => {
    const items = await storage.list(category);
    setPresets(items);
  }, [category]);

  const handleSave = useCallback(async (name: string, data: unknown) => {
    const preset: Preset = {
      id: crypto.randomUUID(),
      name,
      category,
      tags: [],
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    const errors = validatePreset(preset);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return;
    }

    await storage.save(preset);
    loadPresets();
  }, [category, loadPresets]);

  const handleDelete = useCallback(async (id: string) => {
    await storage.delete(id);
    loadPresets();
  }, [loadPresets]);

  const handleSearch = useCallback(async (query: string) => {
    setSearch(query);
    const results = await storage.search(query);
    setPresets(results);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        {presets.map(preset => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div>
              <h4 className="font-medium">{preset.name}</h4>
              <div className="flex gap-1 mt-1">
                {preset.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onSelect(preset)}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetManager;