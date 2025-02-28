import { Preset, PresetCategory, PresetStorage } from '../types';

export class LocalPresetStorage implements PresetStorage {
  private readonly storageKey = 'atari_st_presets';
  private backupInterval: number;

  constructor() {
    this.backupInterval = window.setInterval(() => this.backup(), 5 * 60 * 1000);
  }

  async save(preset: Preset): Promise<void> {
    const presets = await this.getAllPresets();
    const index = presets.findIndex(p => p.id === preset.id);
    
    if (index >= 0) {
      presets[index] = { ...preset, updatedAt: new Date().toISOString() };
    } else {
      presets.push(preset);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(presets));
  }

  async load(id: string): Promise<Preset | null> {
    const presets = await this.getAllPresets();
    return presets.find(p => p.id === id) || null;
  }

  async list(category?: PresetCategory): Promise<Preset[]> {
    const presets = await this.getAllPresets();
    return category ? presets.filter(p => p.category === category) : presets;
  }

  async delete(id: string): Promise<void> {
    const presets = await this.getAllPresets();
    const filtered = presets.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  async search(query: string): Promise<Preset[]> {
    const presets = await this.getAllPresets();
    const normalizedQuery = query.toLowerCase();
    
    return presets.filter(preset => 
      preset.name.toLowerCase().includes(normalizedQuery) ||
      preset.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  private async getAllPresets(): Promise<Preset[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private async backup(): Promise<void> {
    const presets = await this.getAllPresets();
    const backup = JSON.stringify(presets);
    localStorage.setItem(`${this.storageKey}_backup`, backup);
  }

  dispose(): void {
    window.clearInterval(this.backupInterval);
  }
}