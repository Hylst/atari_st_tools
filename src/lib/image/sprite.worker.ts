import { Sprite } from './types';

self.onmessage = async (e: MessageEvent) => {
  const { imageData, width, height, generateMask } = e.data;
  
  const sprite = new Uint8Array(width * height / 2); // 4 bits per pixel
  const mask = generateMask ? new Uint8Array(width * height / 8) : undefined;
  
  // Convert image data to sprite format
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const alpha = imageData[i + 3];
      
      if (generateMask) {
        const byteOffset = Math.floor(x / 8);
        const bitOffset = 7 - (x % 8);
        if (alpha > 128) {
          mask[y * Math.ceil(width / 8) + byteOffset] |= 1 << bitOffset;
        }
      }
      
      // Pack two pixels into one byte (4 bits each)
      if (x % 2 === 0) {
        sprite[Math.floor(y * width / 2 + x / 2)] = imageData[i] >> 4;
      } else {
        sprite[Math.floor(y * width / 2 + x / 2)] |= imageData[i] & 0xF;
      }
    }
  }

  self.postMessage({ sprite, mask });
};