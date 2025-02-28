import { ExportFormat, ExportOptions, ExportResult } from './types';
import { asmFormat } from './formats/asm';
import { gfaFormat } from './formats/gfa';
import { binaryFormat } from './formats/binary';
import { copperFormat } from './formats/copper';

const formats: ExportFormat[] = [
  asmFormat,
  gfaFormat,
  binaryFormat,
  copperFormat
];

export function getExportFormats(): ExportFormat[] {
  return formats;
}

export function exportData(format: string, options: ExportOptions): ExportResult {
  const exporter = formats.find(f => f.id === format);
  if (!exporter) {
    return {
      content: '',
      errors: [`Format d'export inconnu: ${format}`]
    };
  }

  const errors = exporter.validate(options);
  if (errors.length > 0) {
    return { content: '', errors };
  }

  return {
    content: exporter.generate(options),
    errors: []
  };
}