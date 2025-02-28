interface Match {
  offset: number;
  length: number;
}

export class LZ77Compressor {
  private windowSize: number;
  private minMatch: number;
  
  constructor(windowSize = 4096, minMatch = 3) {
    this.windowSize = windowSize;
    this.minMatch = minMatch;
  }
  
  compress(data: Uint8Array): Uint8Array {
    const output: number[] = [];
    let pos = 0;
    
    while (pos < data.length) {
      const match = this.findLongestMatch(data, pos);
      
      if (match && match.length >= this.minMatch) {
        // Write match as (offset, length) pair
        output.push(0x80 | ((match.length - this.minMatch) & 0x0F));
        output.push(match.offset & 0xFF);
        pos += match.length;
      } else {
        // Write literal byte
        output.push(data[pos]);
        pos++;
      }
    }
    
    return new Uint8Array(output);
  }
  
  private findLongestMatch(data: Uint8Array, pos: number): Match | null {
    const windowStart = Math.max(0, pos - this.windowSize);
    let bestMatch: Match | null = null;
    
    for (let i = windowStart; i < pos; i++) {
      let length = 0;
      while (
        pos + length < data.length &&
        data[i + length] === data[pos + length] &&
        length < 18 // Max match length
      ) {
        length++;
      }
      
      if (length >= this.minMatch && (!bestMatch || length > bestMatch.length)) {
        bestMatch = { offset: pos - i, length };
      }
    }
    
    return bestMatch;
  }
}