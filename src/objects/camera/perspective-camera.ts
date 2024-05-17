import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';

export interface PerspectiveProjection {
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

export interface PerspectiveCameraSerialized extends NodeSerialized {
  projection: PerspectiveProjection;
}

export class PerspectiveCamera extends Camera<PerspectiveCameraSerialized> {
  _baseProjection: PerspectiveProjection;

  constructor(
    name: string,
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
    super(name, position, rotation, scale); // Setup Node
    this._baseProjection = projection;
    this.computeProjectionMatrix();
  }

  get baseProjection() {
    return this._baseProjection;
  }

  set baseProjection(val: PerspectiveProjection) {
    this._baseProjection = val;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    // Transformation.perspective() produces a perspective projection matrix
    // with parameters: fov, aspect ratio, near plane, and far plane.
    this.projectionMatrix = Transformation.perspective(
      this._baseProjection.fov,
      this._baseProjection.aspect,
      this._baseProjection.near,
      this._baseProjection.far
    );
  }

  public toJSON(): PerspectiveCameraSerialized {
    return {
      projection: { ...this._baseProjection },
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string, data: PerspectiveProjection) {
    return new PerspectiveCamera(name, data);
  }
}
