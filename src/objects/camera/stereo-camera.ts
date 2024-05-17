import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';

export interface StereoProjection {
  eyeSeparation: number;
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

export interface StereoCameraSerialized extends NodeSerialized {
  projection: StereoProjection;
}

export class StereoCamera extends Camera<StereoCameraSerialized> {
  _baseProjection: StereoProjection;
  leftProjectionMatrix!: Matrix4;
  rightProjectionMatrix!: Matrix4;

  constructor(
    name: string,
    projection: StereoProjection = {
      eyeSeparation: 0.065,
      fov: 75,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000
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

  set baseProjection(val: StereoProjection) {
    this._baseProjection = val;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    // Compute projection matrix for left eye
    this.leftProjectionMatrix = Transformation.perspective(
      this._baseProjection.fov,
      this._baseProjection.aspect,
      this._baseProjection.near,
      this._baseProjection.far
    );

    // Compute projection matrix for right eye with adjusted eye separation
    this.rightProjectionMatrix = Transformation.perspective(
      this._baseProjection.fov,
      this._baseProjection.aspect,
      this._baseProjection.near,
      this._baseProjection.far
    );
    this.rightProjectionMatrix.elements[12] -= this._baseProjection.eyeSeparation;
  }

  public toJSON(): StereoCameraSerialized {
    return {
      projection: { ...this._baseProjection },
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string, data: StereoProjection) {
    return new StereoCamera(name, data);
  }
}
