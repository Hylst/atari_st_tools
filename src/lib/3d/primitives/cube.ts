import { Mesh } from '../types';

export function createCube(size: number = 2): Mesh {
  const s = size / 2;
  
  return {
    vertices: [
      // Face avant
      { position: {x: -s, y: -s, z: s} },  // 0
      { position: {x: s, y: -s, z: s} },   // 1
      { position: {x: s, y: s, z: s} },    // 2
      { position: {x: -s, y: s, z: s} },   // 3
      // Face arrière
      { position: {x: -s, y: -s, z: -s} }, // 4
      { position: {x: s, y: -s, z: -s} },  // 5
      { position: {x: s, y: s, z: -s} },   // 6
      { position: {x: -s, y: s, z: -s} }   // 7
    ],
    faces: [
      { vertices: [0, 1, 2, 3] }, // avant
      { vertices: [5, 4, 7, 6] }, // arrière
      { vertices: [4, 0, 3, 7] }, // gauche
      { vertices: [1, 5, 6, 2] }, // droite
      { vertices: [3, 2, 6, 7] }, // haut
      { vertices: [4, 5, 1, 0] }  // bas
    ]
  };
}