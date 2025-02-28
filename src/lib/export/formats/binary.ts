import { ExportFormat, ExportOptions } from '../types';

export const binaryFormat: ExportFormat = {
  id: 'bin',
  name: 'Binaire',
  extension: 'bin',
  
  validate: (data) => {
    const errors: string[] = [];
    if (data.data.length === 0) {
      errors.push('Les données sont vides');
    }
    return errors;
  },
  
  generate: ({ data }) => {
    return new Uint8Array(data).buffer as unknown as string;
  }
};