import { Mesh } from '../types';

export function createCylinder(radius: number = 1, height: number = 2, segments: number = 16): Mesh {
  const vertices: Mesh['vertices'] = [];
  const faces: Mesh['faces'] = [];
  const halfHeight = height / 2;

  // Vertices du cylindre
  for (let i = 0; i <= segments; i++) {
    const theta = i * 2 * Math.PI / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Vertex supérieur
    vertices.push({
      position: {
        x: cosTheta * radius,
        y: halfHeight,
        z: sinTheta * radius
      }
    });

    // Vertex inférieur
    vertices.push({
      position: {
        x: cosTheta * radius,
        y: -halfHeight,
        z: sinTheta * radius
      }
    });
  }

  // Centre des faces supérieure et inférieure
  const topCenterIndex = vertices.length;
  vertices.push({
    position: { x: 0, y: halfHeight, z: 0 }
  });
  
  const bottomCenterIndex = vertices.length;
  vertices.push({
    position: { x: 0, y: -halfHeight, z: 0 }
  });

  // Faces latérales
  for (let i = 0; i < segments; i++) {
    const v0 = i * 2;
    const v1 = v0 + 1;
    const v2 = v0 + 2;
    const v3 = v0 + 3;

    faces.push({
      vertices: [v0, v2, v3, v1]
    });

    // Face supérieure
    faces.push({
      vertices: [v0, v2, topCenterIndex]
    });

    // Face inférieure
    faces.push({
      vertices: [v1, v3, bottomCenterIndex]
    });
  }

  return { vertices, faces };
}