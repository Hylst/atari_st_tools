import { CopperInstruction, CopperList, CopperEffect, ColorBar } from './types';
import { RGB } from '../palette/types';

// Convertir RGB en valeur Atari ST
function rgbToAtariColor(rgb: RGB): number {
  const r = Math.round((rgb.r / 255) * 7);
  const g = Math.round((rgb.g / 255) * 7);
  const b = Math.round((rgb.b / 255) * 7);
  return (r << 8) | (g << 4) | b;
}

// Générer une liste d'instructions copper pour des barres de couleur
export function generateColorBars(colorBars: ColorBar[]): CopperInstruction[] {
  const instructions: CopperInstruction[] = [];
  
  // Trier les barres par ligne de début
  const sortedBars = [...colorBars].sort((a, b) => a.startLine - b.startLine);
  
  // Générer les instructions pour chaque barre
  sortedBars.forEach(bar => {
    // Instruction pour définir la couleur au début de la barre
    instructions.push({
      scanline: bar.startLine,
      register: 'COLOR00',
      value: rgbToAtariColor(bar.color)
    });
    
    // Instruction pour restaurer la couleur d'origine à la fin de la barre
    if (bar.endLine < 200) { // Ne pas restaurer si c'est la dernière ligne
      instructions.push({
        scanline: bar.endLine,
        register: 'COLOR00',
        value: 0 // Noir par défaut
      });
    }
  });
  
  // Trier les instructions par ligne
  return instructions.sort((a, b) => a.scanline - b.scanline);
}

// Générer un dégradé de couleur
export function generateGradient(
  startLine: number,
  endLine: number,
  startColor: RGB,
  endColor: RGB
): CopperInstruction[] {
  const instructions: CopperInstruction[] = [];
  const steps = endLine - startLine;
  
  if (steps <= 0) return instructions;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const color = {
      r: Math.round(startColor.r + (endColor.r - startColor.r) * t),
      g: Math.round(startColor.g + (endColor.g - startColor.g) * t),
      b: Math.round(startColor.b + (endColor.b - startColor.b) * t)
    };
    
    instructions.push({
      scanline: startLine + i,
      register: 'COLOR00',
      value: rgbToAtariColor(color)
    });
  }
  
  return instructions;
}

// Générer une liste copper complète à partir d'un effet
export function generateCopperList(effect: CopperEffect, name: string = 'copper_list'): CopperList {
  let instructions: CopperInstruction[] = [];
  
  switch (effect.type) {
    case 'colorBars':
      if (effect.colorBars) {
        instructions = generateColorBars(effect.colorBars);
      }
      break;
    case 'gradient':
      if (effect.gradient) {
        const { startLine, endLine, startColor, endColor } = effect.gradient;
        instructions = generateGradient(startLine, endLine, startColor, endColor);
      }
      break;
    case 'custom':
      if (effect.custom) {
        instructions = [...effect.custom];
      }
      break;
  }
  
  return {
    name,
    instructions: instructions.sort((a, b) => a.scanline - b.scanline)
  };
}

// Exporter la liste copper en assembleur 68000
export function exportToASM(copperList: CopperList): string {
  const lines: string[] = [
    `; Copper List: ${copperList.name}`,
    `; Générée automatiquement`,
    ``,
    `${copperList.name}:`,
    `\tdc.w\t${copperList.instructions.length}\t; Nombre d'instructions`,
    ``
  ];
  
  copperList.instructions.forEach(inst => {
    lines.push(`\tdc.w\t${inst.scanline}\t; Ligne`);
    lines.push(`\tdc.w\t${inst.value}\t; Valeur pour ${inst.register}`);
  });
  
  lines.push(`\tdc.w\t-1\t; Fin de la liste`);
  
  return lines.join('\n');
}

// Simuler l'exécution d'une liste copper pour la prévisualisation
export function simulateCopperList(copperList: CopperList): Uint8ClampedArray {
  // Créer une image de 320x200 pixels (4 octets par pixel: RGBA)
  const imageData = new Uint8ClampedArray(320 * 200 * 4);
  
  // Couleur de fond par défaut (noir)
  let currentColor = { r: 0, g: 0, b: 0 };
  
  // Remplir l'image ligne par ligne
  for (let y = 0; y < 200; y++) {
    // Trouver les instructions pour cette ligne
    const instructions = copperList.instructions.filter(inst => inst.scanline === y);
    
    // Appliquer les instructions
    for (const inst of instructions) {
      if (inst.register === 'COLOR00') {
        const value = inst.value;
        currentColor = {
          r: ((value >> 8) & 0x7) * 255 / 7,
          g: ((value >> 4) & 0x7) * 255 / 7,
          b: (value & 0x7) * 255 / 7
        };
      }
    }
    
    // Remplir la ligne avec la couleur actuelle
    for (let x = 0; x < 320; x++) {
      const offset = (y * 320 + x) * 4;
      imageData[offset] = currentColor.r;
      imageData[offset + 1] = currentColor.g;
      imageData[offset + 2] = currentColor.b;
      imageData[offset + 3] = 255; // Alpha (opaque)
    }
  }
  
  return imageData;
}