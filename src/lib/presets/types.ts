export interface Preset {
  id: string;
  name: string;
  category: PresetCategory;
  tags: string[];
  data: unknown;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type PresetCategory = '3d' | 'curves' | 'palette' | 'sprite';

export interface PresetValidationError {
  field: string;
  message: string;
}

export interface PresetStorage {
  save(preset: Preset): Promise<void>;
  load(id: string): Promise<Preset | null>;
  list(category?: PresetCategory): Promise<Preset[]>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Preset[]>;
}