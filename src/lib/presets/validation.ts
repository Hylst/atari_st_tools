import { Preset, PresetValidationError } from './types';

const MAX_NAME_LENGTH = 50;
const MAX_TAGS = 10;
const MAX_DATA_SIZE = 1024 * 1024; // 1MB

export function validatePreset(preset: Preset): PresetValidationError[] {
  const errors: PresetValidationError[] = [];

  // Validate name
  if (!preset.name.trim()) {
    errors.push({ field: 'name', message: 'Le nom est requis' });
  } else if (preset.name.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'name', message: `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères` });
  }

  // Validate tags
  if (preset.tags.length > MAX_TAGS) {
    errors.push({ field: 'tags', message: `Maximum ${MAX_TAGS} tags autorisés` });
  }

  // Validate data size
  const dataSize = new TextEncoder().encode(JSON.stringify(preset.data)).length;
  if (dataSize > MAX_DATA_SIZE) {
    errors.push({ field: 'data', message: 'Données trop volumineuses' });
  }

  return errors;
}