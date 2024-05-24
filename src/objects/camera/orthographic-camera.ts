import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { ObliqueProjection } from '@/objects/camera/oblique-camera.ts';

export interface OrthographicProjection {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;
}

export interface OrthographicCameraSerialized extends NodeSerialized {
  projection: OrthographicProjection;
}

export class OrthographicCamera extends Camera<OrthographicCameraSerialized> {
  _baseProjection: OrthographicProjection;
  _defaultProjection: OrthographicProjection;

  constructor(
    name: string,
    projection: OrthographicProjection = {
      top: 1,
      bottom: -1,
      left: -1,
      right: 1,
      near: -2000,
      far: 2000
    },
    position?: Vector3,
    rotation?: Euler,
    scale?: Vector3
  ) {
    super(name, position, rotation, scale); // Setup Node
    this._baseProjection = projection;
    this._defaultProjection = { ...projection };
    this.computeProjectionMatrix();
  }

  get baseProjection() {
    return this._baseProjection;
  }

  set baseProjection(val: OrthographicProjection) {
    this._baseProjection = val;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    const dx =
      (this._baseProjection.right - this._baseProjection.left) /
      (2 * this.zoom);
    const dy =
      (this._baseProjection.top - this._baseProjection.bottom) /
      (2 * this.zoom);
    const cx = (this._baseProjection.right + this._baseProjection.left) / 2;
    const cy = (this._baseProjection.top + this._baseProjection.bottom) / 2;

    const left = cx - dx;
    const right = cx + dx;
    const top = cy + dy;
    const bottom = cy - dy;

    // M4.orthographic() menghasilkan proyeksi matriks ortografik
    // dengan 6 tupel left, right, bottom, top, near, dan far.
    this.projectionMatrix = Transformation.orthographic(
      left,
      right,
      bottom,
      top,
      this._baseProjection.near,
      this._baseProjection.far
    );
  }

  public toJSON(): OrthographicCameraSerialized {
    return {
      projection: { ...this._baseProjection },
      ...this.toNodeSerialized()
    };
  }

  public static fromJSON(name: string, data: OrthographicProjection) {
    return new OrthographicCamera(name, data);
  }

  public resetProjection() {
    this._baseProjection = { ...this._defaultProjection };
  }
}
