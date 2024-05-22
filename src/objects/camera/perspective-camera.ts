import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { degreeToRadian, radianToDegree } from '@/utils/math/angle.ts';

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
      fov: 90,
      aspect: 1,
      near: 0.1, // in perspective camera, near should be more than 0
      far: 2000
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
    const near = this._baseProjection.near;
    const far = this._baseProjection.far;
    const top =
      (near * Math.tan(degreeToRadian(0.5 * this.baseProjection.fov))) /
      this.zoom;
    const height = 2 * top;
    const width = this._baseProjection.aspect * height;
    const left = -0.5 * width;

    this.projectionMatrix = Transformation.perspective(
      left,
      left + width,
      top,
      top - height,
      near,
      far
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
