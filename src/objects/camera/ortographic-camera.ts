import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';

interface OrthographicProjection {
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

  constructor(
    name: string,
    projection: OrthographicProjection = {
      top: 1,
      bottom: -1,
      left: -1,
      right: 1,
      near: 1,
      far: -1
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

  set baseProjection(val: OrthographicProjection) {
    this._baseProjection = val;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    // M4.orthographic() menghasilkan proyeksi matriks ortografik
    // dengan 6 tupel left, right, bottom, top, near, dan far.
    this.projectionMatrix = Transformation.orthographic(
      this._baseProjection.left,
      this._baseProjection.right,
      this._baseProjection.bottom,
      this._baseProjection.top,
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
}
