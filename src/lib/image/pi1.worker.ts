import { RGB, PI1Image } from './types';
import { findClosestColor } from './color';

const PI1_SIZE = 32034; // Taille fixe d'un fichier PI1
const PI1_HEADER_SIZE = 34; // Taille de l'en-tête PI1

self.onmessage = async (e: MessageEvent) => {
  const { 
    imageData, 
    width, 
    height, 
    ditherLevel = 0, 
    optimizePalette = true,
    customPalette,
    fromPI1 = false
  } = e.data;
  
  const pixels = new Uint8Array(imageData);
  
  // Créer une palette Atari ST (16 couleurs)
  let palette: RGB[] = [];
  
  if (customPalette) {
    // Utiliser la palette personnalisée
    palette = customPalette;
  } else if (fromPI1) {
    // Extraire la palette du fichier PI1
    palette = extractPaletteFromPI1(pixels);
  } else if (optimizePalette) {
    // Générer une palette optimisée à partir de l'image
    palette = generateOptimizedPalette(pixels, width, height);
  } else {
    // Palette par défaut
    palette = generateDefaultPalette();
  }
  
  // Créer les données de l'image PI1
  const pi1Data = new Uint8Array(PI1_SIZE);
  
  // En-tête PI1
  pi1Data[0] = 0; // Resolution (0 = low)
  pi1Data[1] = 0;
  
  // Palette dans l'en-tête
  for (let i = 0; i < 16; i++) {
    const color = palette[i];
    const value = (
      ((Math.round(color.r / 255 * 7) & 0x7) << 8) |
      ((Math.round(color.g / 255 * 7) & 0x7) << 4) |
      (Math.round(color.b / 255 * 7) & 0x7)
    );
    pi1Data[2 + i * 2] = (value >> 8) & 0xFF;
    pi1Data[3 + i * 2] = value & 0xFF;
  }

  // Convertir l'image en format bitplane
  const bitplanes = new Uint8Array(32000);
  const previewData = new Uint8ClampedArray(320 * 200 * 4);

  // Appliquer le dithering si nécessaire
  const processedPixels = ditherLevel > 0 
    ? applyDithering(pixels, width, height, palette, ditherLevel / 10)
    : pixels;

  for (let y = 0; y < 200; y++) {
    for (let x = 0; x < 320; x++) {
      // Si on est en dehors des dimensions de l'image source, utiliser du noir
      let colorIndex = 0;
      
      if (x < width && y < height) {
        const srcIdx = (y * width + x) * 4;
        const rgb: RGB = {
          r: processedPixels[srcIdx],
          g: processedPixels[srcIdx + 1],
          b: processedPixels[srcIdx + 2]
        };
        
        colorIndex = findClosestColor(rgb, palette);
      }
      
      // Convertir en format bitplane
      const byteOffset = Math.floor(x / 8);
      const bitOffset = 7 - (x % 8);
      
      for (let plane = 0; plane < 4; plane++) {
        const planeOffset = plane * 8000;
        if (colorIndex & (1 << plane)) {
          bitplanes[planeOffset + y * 40 + byteOffset] |= 1 << bitOffset;
        }
      }

      // Données pour la prévisualisation
      const dstIdx = (y * 320 + x) * 4;
      const color = palette[colorIndex];
      previewData[dstIdx] = color.r;
      previewData[dstIdx + 1] = color.g;
      previewData[dstIdx + 2] = color.b;
      previewData[dstIdx + 3] = 255;
    }
  }

  // Copier les bitplanes dans le fichier PI1
  pi1Data.set(bitplanes, PI1_HEADER_SIZE);

  const pi1: PI1Image = {
    header: {
      resolution: 0,
      palette
    },
    data: pi1Data,
    width: 320,
    height: 200,
    imageData: new ImageData(previewData, 320, 200)
  };

  self.postMessage(pi1);
};

// Extraire la palette d'un fichier PI1
function extractPaletteFromPI1(data: Uint8Array): RGB[] {
  const palette: RGB[] = [];
  
  for (let i = 0; i < 16; i++) {
    const value = (data[2 + i * 2] << 8) | data[2 + i * 2 + 1];
    palette.push({
      r: ((value >> 8) & 0x7) * 255 / 7,
      g: ((value >> 4) & 0x7) * 255 / 7,
      b: (value & 0x7) * 255 / 7
    });
  }
  
  return palette;
}

// Générer une palette par défaut
function generateDefaultPalette(): RGB[] {
  return [
    { r: 0, g: 0, b: 0 },        // Noir
    { r: 255, g: 255, b: 255 },  // Blanc
    { r: 255, g: 0, b: 0 },      // Rouge
    { r: 0, g: 255, b: 0 },      // Vert
    { r: 0, g: 0, b: 255 },      // Bleu
    { r: 255, g: 255, b: 0 },    // Jaune
    { r: 255, g: 0, b: 255 },    // Magenta
    { r: 0, g: 255, b: 255 },    // Cyan
    { r: 128, g: 128, b: 128 },  // Gris
    { r: 192, g: 192, b: 192 },  // Gris clair
    { r: 128, g: 0, b: 0 },      // Rouge foncé
    { r: 0, g: 128, b: 0 },      // Vert foncé
    { r: 0, g: 0, b: 128 },      // Bleu foncé
    { r: 128, g: 128, b: 0 },    // Jaune foncé
    { r: 128, g: 0, b: 128 },    // Magenta foncé
    { r: 0, g: 128, b: 128 }     // Cyan foncé
  ];
}

// Générer une palette optimisée à partir de l'image
function generateOptimizedPalette(pixels: Uint8Array, width: number, height: number): RGB[] {
  // Méthode simple : utiliser un algorithme de médiane coupée
  // Pour une implémentation plus avancée, on pourrait utiliser k-means ou octree
  
  // Collecter tous les pixels non transparents
  const colors: RGB[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (pixels[idx + 3] > 128) { // Pixel non transparent
        colors.push({
          r: pixels[idx],
          g: pixels[idx + 1],
          b: pixels[idx + 2]
        });
      }
    }
  }
  
  // Si pas assez de couleurs, utiliser la palette par défaut
  if (colors.length < 16) {
    return generateDefaultPalette();
  }
  
  // Réduire à 16 couleurs avec médiane coupée
  const palette = medianCut(colors, 16);
  
  // Assurer que noir et blanc sont dans la palette
  let hasBlack = false;
  let hasWhite = false;
  
  for (const color of palette) {
    if (color.r === 0 && color.g === 0 && color.b === 0) hasBlack = true;
    if (color.r === 255 && color.g === 255 && color.b === 255) hasWhite = true;
  }
  
  if (!hasBlack) palette[0] = { r: 0, g: 0, b: 0 };
  if (!hasWhite) palette[1] = { r: 255, g: 255, b: 255 };
  
  return palette;
}

// Algorithme de médiane coupée pour la réduction de couleurs
function medianCut(colors: RGB[], maxColors: number): RGB[] {
  if (colors.length === 0) return generateDefaultPalette();
  
  // Fonction pour calculer la moyenne d'un ensemble de couleurs
  const averageColor = (colorSet: RGB[]): RGB => {
    let r = 0, g = 0, b = 0;
    for (const color of colorSet) {
      r += color.r;
      g += color.g;
      b += color.b;
    }
    return {
      r: Math.round(r / colorSet.length),
      g: Math.round(g / colorSet.length),
      b: Math.round(b / colorSet.length)
    };
  };
  
  // Fonction pour trouver la composante avec la plus grande plage
  const findLargestRange = (colorSet: RGB[]): 'r' | 'g' | 'b' => {
    let rMin = 255, rMax = 0;
    let gMin = 255, gMax = 0;
    let bMin = 255, bMax = 0;
    
    for (const color of colorSet) {
      rMin = Math.min(rMin, color.r);
      rMax = Math.max(rMax, color.r);
      gMin = Math.min(gMin, color.g);
      gMax = Math.max(gMax, color.g);
      bMin = Math.min(bMin, color.b);
      bMax = Math.max(bMax, color.b);
    }
    
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    
    if (rRange >= gRange && rRange >= bRange) return 'r';
    if (gRange >= rRange && gRange >= bRange) return 'g';
    return 'b';
  };
  
  // Fonction récursive pour diviser l'espace de couleurs
  const splitColors = (colorSet: RGB[], depth: number): RGB[] => {
    if (colorSet.length === 0) return [];
    if (depth === 0 || colorSet.length === 1) return [averageColor(colorSet)];
    
    const component = findLargestRange(colorSet);
    colorSet.sort((a, b) => a[component] - b[component]);
    
    const median = Math.floor(colorSet.length / 2);
    const set1 = colorSet.slice(0, median);
    const set2 = colorSet.slice(median);
    
    return [
      ...splitColors(set1, depth - 1),
      ...splitColors(set2, depth - 1)
    ];
  };
  
  // Calculer la profondeur nécessaire pour obtenir maxColors
  const depth = Math.ceil(Math.log2(maxColors));
  
  // Diviser l'espace de couleurs
  const palette = splitColors(colors, depth);
  
  // Si on a trop de couleurs, réduire
  if (palette.length > maxColors) {
    palette.length = maxColors;
  }
  
  // Si on a trop peu de couleurs, ajouter des couleurs par défaut
  if (palette.length < maxColors) {
    const defaultPalette = generateDefaultPalette();
    for (let i = palette.length; i < maxColors; i++) {
      palette.push(defaultPalette[i]);
    }
  }
  
  // Quantifier les couleurs pour l'Atari ST (3 bits par composante)
  return palette.map(color => ({
    r: Math.round(Math.round(color.r / 255 * 7) * 255 / 7),
    g: Math.round(Math.round(color.g / 255 * 7) * 255 / 7),
    b: Math.round(Math.round(color.b / 255 * 7) * 255 / 7)
  }));
}

// Appliquer le dithering à l'image
function applyDithering(
  pixels: Uint8Array, 
  width: number, 
  height: number, 
  palette: RGB[],
  strength: number
): Uint8Array {
  // Copier les pixels pour ne pas modifier l'original
  const result = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    result[i] = pixels[i];
  }
  
  // Appliquer le dithering Floyd-Steinberg
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Pixel actuel
      const oldR = result[idx];
      const oldG = result[idx + 1];
      const oldB = result[idx + 2];
      
      // Trouver la couleur la plus proche dans la palette
      const oldColor: RGB = { r: oldR, g: oldG, b: oldB };
      const colorIndex = findClosestColor(oldColor, palette);
      const newColor = palette[colorIndex];
      
      // Mettre à jour le pixel
      result[idx] = newColor.r;
      result[idx + 1] = newColor.g;
      result[idx + 2] = newColor.b;
      
      // Calculer l'erreur
      const errR = (oldR - newColor.r) * strength;
      const errG = (oldG - newColor.g) * strength;
      const errB = (oldB - newColor.b) * strength;
      
      // Distribuer l'erreur aux pixels voisins
      if (x + 1 < width) {
        const idx2 = idx + 4;
        result[idx2] = Math.min(255, Math.max(0, result[idx2] + errR * 7 / 16));
        result[idx2 + 1] = Math.min(255, Math.max(0, result[idx2 + 1] + errG * 7 / 16));
        result[idx2 + 2] = Math.min(255, Math.max(0, result[idx2 + 2] + errB * 7 / 16));
      }
      
      if (y + 1 < height) {
        if (x > 0) {
          const idx2 = idx + width * 4 - 4;
          result[idx2] = Math.min(255, Math.max(0, result[idx2] + errR * 3 / 16));
          result[idx2 + 1] = Math.min(255, Math.max(0, result[idx2 + 1] + errG * 3 / 16));
          result[idx2 + 2] = Math.min(255, Math.max(0, result[idx2 + 2] + errB * 3 / 16));
        }
        
        const idx2 = idx + width * 4;
        result[idx2] = Math.min(255, Math.max(0, result[idx2] + errR * 5 / 16));
        result[idx2 + 1] = Math.min(255, Math.max(0, result[idx2 + 1] + errG * 5 / 16));
        result[idx2 + 2] = Math.min(255, Math.max(0, result[idx2 + 2] + errB * 5 / 16));
        
        if (x + 1 < width) {
          const idx2 = idx + width * 4 + 4;
          result[idx2] = Math.min(255, Math.max(0, result[idx2] + errR * 1 / 16));
          result[idx2 + 1] = Math.min(255, Math.max(0, result[idx2 + 1] + errG * 1 / 16));
          result[idx2 + 2] = Math.min(255, Math.max(0, result[idx2 + 2] + errB * 1 / 16));
        }
      }
    }
  }
  
  return result;
}

function getPixelColor(bitplanes: Uint8Array, x: number, y: number): number {
  let color = 0;
  const byteOffset = Math.floor(x / 8);
  const bitOffset = 7 - (x % 8);
  
  for (let plane = 0; plane < 4; plane++) {
    const planeOffset = plane * 8000;
    if (bitplanes[planeOffset + y * 40 + byteOffset] & (1 << bitOffset)) {
      color |= 1 << plane;
    }
  }
  
  return color;
}