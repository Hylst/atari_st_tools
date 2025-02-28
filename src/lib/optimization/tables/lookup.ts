export function optimizeLookupTable(data: number[], bits: number = 8): {
  table: Int16Array,
  shift: number
} {
  // Convert to fixed point
  const scale = 1 << bits;
  const table = new Int16Array(data.length);
  
  // Find optimal scaling
  const maxValue = Math.max(...data.map(Math.abs));
  const shift = Math.floor(Math.log2(32767 / maxValue));
  
  // Scale and convert values
  for (let i = 0; i < data.length; i++) {
    table[i] = Math.round(data[i] * (1 << shift));
  }
  
  return { table, shift };
}

export function generateSinTable(size: number = 256): Int16Array {
  const table = new Int16Array(size);
  for (let i = 0; i < size; i++) {
    const angle = (i * 2 * Math.PI) / size;
    table[i] = Math.round(Math.sin(angle) * 32767);
  }
  return table;
}