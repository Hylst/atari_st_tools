import { ExportFormat, ExportOptions } from '../types';

export const gfaFormat: ExportFormat = {
  id: 'gfa',
  name: 'GFA BASIC',
  extension: 'bas',
  
  validate: (data) => {
    const errors: string[] = [];
    if (!data.data || data.data.length === 0) {
      errors.push('Les données sont vides');
      return errors;
    }
    if (data.data.length > 32767) {
      errors.push('Les données dépassent la taille maximale (32767 octets)');
    }
    return errors;
  },
  
  generate: ({ name, data }) => {
    const lines: string[] = [
      `REM ${name}`,
      `DIM ${name}%(${Math.ceil(data.length / 2)})`,
      ''
    ];

    // Convert bytes to words for GFA BASIC
    for (let i = 0; i < data.length; i += 16) {
      const chunk = Array.from(data.slice(i, i + 16));
      const words = chunk.reduce((acc, byte, j) => {
        if (j % 2 === 0) {
          acc.push((byte << 8) | (chunk[j + 1] || 0));
        }
        return acc;
      }, [] as number[]);
      
      lines.push(`DATA ${words.join(',')}`);
    }
    
    lines.push('');
    lines.push(`PROCEDURE Load_${name}`);
    lines.push('  READ I%');
    lines.push(`  FOR I%=0 TO ${Math.ceil(data.length / 2) - 1}`);
    lines.push(`    READ ${name}%(I%)`);
    lines.push('  NEXT I%');
    lines.push('RETURN');
    
    return lines.join('\n');
  }
};