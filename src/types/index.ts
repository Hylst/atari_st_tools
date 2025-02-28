export interface Palette {
  colors: string[];
  name: string;
}

export interface Sprite {
  width: number;
  height: number;
  data: Uint8Array;
  palette: Palette;
}

export interface PI1Image {
  width: number;
  height: number;
  data: Uint8Array;
  palette: Palette;
}