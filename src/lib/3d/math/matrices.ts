import { Matrix4x4, Vector3 } from '../types';

export function createIdentityMatrix(): Matrix4x4 {
  return {
    m: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  };
}

export function createRotationMatrix(angle: number, axis: Vector3): Matrix4x4 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const {x, y, z} = normalize(axis);

  return {
    m: [
      t*x*x + c,   t*x*y - s*z, t*x*z + s*y, 0,
      t*x*y + s*z, t*y*y + c,   t*y*z - s*x, 0,
      t*x*z - s*y, t*y*z + s*x, t*z*z + c,   0,
      0,           0,           0,           1
    ]
  };
}

export function createProjectionMatrix(fov: number, aspect: number, near: number, far: number): Matrix4x4 {
  const f = 1.0 / Math.tan(fov / 2);
  
  return {
    m: [
      f/aspect, 0, 0,                          0,
      0,        f, 0,                          0,
      0,        0, (far+near)/(near-far),     -1,
      0,        0, (2*far*near)/(near-far),    0
    ]
  };
}