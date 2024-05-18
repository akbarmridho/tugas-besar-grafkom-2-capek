import { PerspectiveCamera, PerspectiveProjection } from './perspective-camera';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';
import { Euler } from '@/utils/math/euler';

export interface ObliqueProjection extends PerspectiveProjection {
  theta?: number; // Angle of obliqueness in radians
}

export class ObliqueCamera extends PerspectiveCamera {
  private theta: number;

  constructor(
    name: string,
    theta: number = 0.0, // Default angle of obliqueness
    projection: PerspectiveProjection = {
      fov: 75,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000
    },
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, projection, position, rotation, scale);
    this.theta = theta;
  }

  computeProjectionMatrix() {
    // Compute the standard perspective projection matrix
    super.computeProjectionMatrix();

    // Apply oblique projection transformation
    this.projectionMatrix = this.computeObliqueProjectionMatrix(this.projectionMatrix, this.theta);
  }

  private computeObliqueProjectionMatrix(matrix: Matrix4, theta: number): Matrix4 {
    // Compute the oblique projection matrix transformation
    const near = this.baseProjection.near;
    const far = this.baseProjection.far;
    const tanTheta = Math.tan(theta);

    const c = (far + near) / (far - near);
    const d = (2 * far * near) / (far - near);

    const obliqueMatrix = new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      tanTheta, 0, 1, 0,
      0, 0, 0, 1
    ]);

    // Apply the oblique projection transformation to the standard perspective projection matrix
    return matrix.multiplyMatrix(obliqueMatrix);
  }
}
