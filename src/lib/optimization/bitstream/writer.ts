export class BitStreamWriter {
  private buffer: number[] = [];
  private currentByte: number = 0;
  private bitCount: number = 0;

  writeBits(value: number, bits: number): void {
    while (bits > 0) {
      const remainingBits = 8 - this.bitCount;
      const bitsToWrite = Math.min(bits, remainingBits);
      const mask = (1 << bitsToWrite) - 1;
      const shiftedValue = (value >> (bits - bitsToWrite)) & mask;
      
      this.currentByte |= shiftedValue << (remainingBits - bitsToWrite);
      this.bitCount += bitsToWrite;
      bits -= bitsToWrite;

      if (this.bitCount === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitCount = 0;
      }
    }
  }

  getBuffer(): Uint8Array {
    if (this.bitCount > 0) {
      this.buffer.push(this.currentByte);
    }
    return new Uint8Array(this.buffer);
  }
}