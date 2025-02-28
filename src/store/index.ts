import { create } from 'zustand';
import { Palette, Sprite, PI1Image } from '../types';

interface AppState {
  currentPalette: Palette | null;
  currentSprite: Sprite | null;
  currentImage: PI1Image | null;
  setCurrentPalette: (palette: Palette) => void;
  setCurrentSprite: (sprite: Sprite) => void;
  setCurrentImage: (image: PI1Image) => void;
}

export const useStore = create<AppState>((set) => ({
  currentPalette: null,
  currentSprite: null,
  currentImage: null,
  setCurrentPalette: (palette) => set({ currentPalette: palette }),
  setCurrentSprite: (sprite) => set({ currentSprite: sprite }),
  setCurrentImage: (image) => set({ currentImage: image }),
}));