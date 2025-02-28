import { Mesh } from '../types';

interface AtariMesh {
  vertices: Int16Array;  // Fixed point 8.8
  faces: Uint16Array;    // Indices
  normals?: Int8Array;   // Normalized vectors
}

export function optimizeMesh(mesh: Mesh): AtariMesh {
  // Convert to fixed point and optimize data structures
  const vertices = new Int16Array(mesh.vertices.length * 3);
  const faces = new Uint16Array(mesh.faces.length * 4);
  
  // Pack vertices (fixed point 8.8)
  mesh.vertices.forEach((v, i) => {
    vertices[i*3]   = Math.round(v.position.x * 256);
    vertices[i*3+1] = Math.round(v.position.y * 256);
    vertices[i*3+2] = Math.round(v.position.z * 256);
  });
  
  // Pack faces
  mesh.faces.forEach((f, i) => {
    faces[i*4]   = f.vertices[0];
    faces[i*4+1] = f.vertices[1];
    faces[i*4+2] = f.vertices[2];
    faces[i*4+3] = f.vertices[3];
  });
  
  return { vertices, faces };
}

export function generateLookupTables(): {sin: Int16Array, cos: Int16Array} {
  const sin = new Int16Array(256);
  const cos = new Int16Array(256);
  
  for (let i = 0; i < 256; i++) {
    const angle = (i * Math.PI * 2) / 256;
    sin[i] = Math.round(Math.sin(angle) * 256);
    cos[i] = Math.round(Math.cos(angle) * 256);
  }
  
  return { sin, cos };
}