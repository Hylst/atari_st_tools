import { ExportFormat, ExportOptions } from '../types';

export const asmFormat: ExportFormat = {
  id: 'asm',
  name: 'Assembleur 68000',
  extension: 'asm',
  
  validate: (data) => {
    const errors: string[] = [];
    if (data.data.length === 0) {
      errors.push('Les données sont vides');
    }
    return errors;
  },
  
  generate: ({ name, data, symbols = {} }) => {
    const lines: string[] = [
      `; ${name}`,
      '\tsection\tdata',
      ''
    ];

    // Symbols
    Object.entries(symbols).forEach(([symbol, value]) => {
      lines.push(`${symbol}\tequ\t${value}`);
    });
    lines.push('');

    // Data
    lines.push(`${name}:`);
    for (let i = 0; i < data.length; i += 8) {
      const chunk = Array.from(data.slice(i, i + 8));
      lines.push(`\tdc.b\t${chunk.join(',')}`);
    }
    
    return lines.join('\n');
  }
};