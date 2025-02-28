export const HARDWARE_CONSTRAINTS = {
  memory: {
    totalRAM: 512 * 1024,  // 512KB
    systemReserved: 32 * 1024,
    screenMemory: 32 * 1024,
    minStackSpace: 4 * 1024
  },
  
  blitter: {
    maxWidth: 1024,
    maxHeight: 1024,
    minSourcePitch: 2,
    maxDestPitch: 256
  },
  
  display: {
    lowRes: { width: 320, height: 200 },
    medRes: { width: 640, height: 200 },
    hiRes: { width: 640, height: 400 },
    maxColors: 16,
    vblDuration: 2500  // cycles
  },
  
  floppy: {
    sectorSize: 512,
    sectorsPerTrack: 9,
    tracksPerSide: 80,
    sides: 2
  }
};

export function checkMemoryConstraints(size: number): string[] {
  const errors: string[] = [];
  const { memory } = HARDWARE_CONSTRAINTS;
  
  const availableRAM = memory.totalRAM - memory.systemReserved - 
                      memory.screenMemory - memory.minStackSpace;
                      
  if (size > availableRAM) {
    errors.push(`Dépassement mémoire: ${size} octets requis, ${availableRAM} disponibles`);
  }
  
  return errors;
}