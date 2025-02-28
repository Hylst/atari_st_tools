import { Mesh } from '../types';

export function createSphere(radius: number = 1, segments: number = 16): Mesh {
  const vertices: Mesh['vertices'] = [];
  const faces: Mesh['faces'] = [];
  
  // Générer les vertices
  for (let lat = 0; lat <= segments; lat++) {
    const theta = lat * Math.PI / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= segments; lon++) {
      const phi = lon * 2 * Math.PI / segments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta * radius;
      const y = cosTheta * radius;
      const z = sinPhi * sinTheta * radius;

      vertices.push({
        position: { x, y, z }
      });
    }
  }

  // Générer les faces
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const first = lat * (segments + 1) + lon;
      const second = first + segments + 1;

      faces.push({
        vertices: [
          first,
          second,
          second + 1,
          first + 1
        ]
      });
    }
  }

  return { vertices, faces };
}