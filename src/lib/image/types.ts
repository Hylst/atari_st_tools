export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PI1Header {
  resolution: number;
  palette: RGB[];
}

export interface PI1Image {
  header: PI1Header;
  data: Uint8Array;
  width: number;
  height: number;
  imageData: ImageData; // Ajout d'un champ pour stocker l'ImageData
}

export interface Sprite {
  data: Uint8Array;
  mask?: Uint8Array;
  width: number;
  height: number;
  palette: RGB[];
}