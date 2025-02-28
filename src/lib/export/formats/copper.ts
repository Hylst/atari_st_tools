import { ExportFormat, ExportOptions } from '../types';

export const copperFormat: ExportFormat = {
  id: 'copper',
  name: 'Copper List',
  extension: 's',
  
  validate: (data) => {
    const errors: string[] = [];
    if (data.data.length === 0) {
      errors.push('Les données sont vides');
    }
    return errors;
  },
  
  generate: ({ name, data, symbols = {} }) => {
    const lines: string[] = [
      `; ${name} - Copper List`,
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
    lines.push(`\tdc.w\t${Math.floor(data.length / 2)}\t; Nombre d'instructions`);
    
    // Chaque instruction copper est une paire (scanline, valeur)
    for (let i = 0; i < data.length; i += 2) {
      const scanline = data[i];
      const value = data[i + 1];
      lines.push(`\tdc.w\t${scanline}\t; Ligne`);
      lines.push(`\tdc.w\t${value}\t; Valeur`);
    }
    
    lines.push(`\tdc.w\t-1\t; Fin de la liste`);
    
    return lines.join('\n');
  }
};