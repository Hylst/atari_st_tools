export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Matrix4x4 {
  m: number[];
}

export interface Vertex {
  position: Vector3;
  normal?: Vector3;
}

export interface Face {
  vertices: number[];
  normal?: Vector3;
}

export interface Mesh {
  vertices: Vertex[];
  faces: Face[];
}

export interface Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

export type ProjectionType = 'perspective' | 'parallel';