import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';

export interface ObliqueProjection {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;
  alpha: number;
}

export interface ObliqueCameraSerialized extends NodeSerialized {
  projection: ObliqueProjection;
}

export class ObliqueCamera extends Camera<ObliqueCameraSerialized> {
  _baseProjection: ObliqueProjection;
  _defaultProjection: ObliqueProjection;

  constructor(
    name: string,
    projection: ObliqueProjection = {
      top: 1,
      bottom: -1,
      left: -1,
      right: 1,
      near: -2000,
      far: 2000,
      alpha: Math.PI / 4
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

  set baseProjection(val: ObliqueProjection) {
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

    const projection = Transformation.orthographic(
      left,
      right,
      bottom,
      top,
      this._baseProjection.near,
      this._baseProjection.far
    );

    // shear matrix
    // ref: http://www.flipcode.com/documents/matrfaq.html#Q43
    //        | 1    Syx  Szx  0 |
    //        |                  |
    //        | Sxy  1    Szy  0 |
    //    M = |                  |
    //        | Sxz  Syz  1    0 |
    //        |                  |
    //        | 0    0    0    1 |
    //        |                  |
    const alpha = Math.PI / 6; // or Math.PI / 4

    const Syx = 0,
      Szx = -0.5 * Math.cos(alpha),
      Sxy = 0,
      Szy = -0.5 * Math.sin(alpha),
      Sxz = 0,
      Syz = 0;

    // note:
    // we translate x by -0.4 and y by -0.25
    // in order to make the object centered to canvas
    // prettier-ignore
    const shear = new Matrix4([
      1, Syx, Szx, -0.4,
      Sxy, 1, Szy, -0.25,
      Sxz, Syz, 1, 0,
      0, 0, 0, 1
    ]);

    this.projectionMatrix = projection.preMultiplyMatrix(shear);
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

  public resetProjection() {
    this._baseProjection = { ...this._defaultProjection };
  }
}
