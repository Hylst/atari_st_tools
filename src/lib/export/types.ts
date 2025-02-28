export interface ExportOptions {
  name: string;
  label?: string;
  data: number[] | Uint8Array;
  symbols?: Record<string, number>;
}

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  validate: (data: ExportOptions) => string[];
  generate: (data: ExportOptions) => string;
}

export interface ExportResult {
  content: string;
  errors: string[];
}