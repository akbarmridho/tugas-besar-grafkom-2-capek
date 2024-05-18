import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';

export interface ObliqueProjection {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  theta: number; // Angle of obliqueness in radians
}

export interface ObliqueCameraSerialized extends NodeSerialized {
  projection: ObliqueProjection;
}

export class ObliqueCamera extends Camera<ObliqueCameraSerialized> {
  _baseProjection: ObliqueProjection;

  constructor(
    name: string,
    projection: ObliqueProjection = {
      fov: 75,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000,
      theta: 0.0 // Default angle of obliqueness
    },
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, position, rotation, scale); // Setup Node
    this._baseProjection = projection;
    this.computeProjectionMatrix();
  }

  get baseProjection() {
    return this._baseProjection;
  }

  set baseProjection(val: ObliqueProjection) {
    this._baseProjection = val;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    // Compute the standard perspective projection matrix
    this.projectionMatrix = Transformation.perspective(
      this._baseProjection.fov,
      this._baseProjection.aspect,
      this._baseProjection.near,
      this._baseProjection.far
    );

    // Apply oblique projection transformation
    this.projectionMatrix = this.computeObliqueProjectionMatrix(
      this.projectionMatrix,
      this._baseProjection.theta
    );
  }

  private computeObliqueProjectionMatrix(matrix: Matrix4, theta: number): Matrix4 {
    // Compute the oblique projection matrix transformation
    const near = this._baseProjection.near;
    const far = this._baseProjection.far;
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

  public toJSON(): ObliqueCameraSerialized {
    return {
      projection: { ...this._baseProjection },
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string, data: ObliqueProjection) {
    return new ObliqueCamera(name, data);
  }
}
