import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import {
  BufferAttribute,
  BufferAttributeSerialized
} from '@/objects/base/buffer-attribute.ts';
import {
  quadFromCoord,
  quadFromCoordExtrapolated,
  quadFromPoints,
  quadFromPointsExtrapolated
} from '@/utils/coordinates.ts';

export interface BoxGeometryProps {
  width: number;
  height: number;
  length: number;
}

export type BoxGeometrySerialized = BufferGeometrySerialized & BoxGeometryProps;

export class BoxGeometry extends BufferGeometry<BoxGeometrySerialized> {
  width: number;
  height: number;
  length: number;

  constructor(width: number = 1, height: number = 1, length: number = 1) {
    /**
     * x-axis: width
     * y-axis: height
     * z-axis: length
     */
    const hw = width / 2;
    const hh = height / 2;
    const hl = length / 2;

    /**
     * Box
     *    e ---- f
     *  / |     /|
     * a ---- b  |
     * |  h --|- g
     * |/     |/
     * d ---- c
     *
     * six faces
     * a b c d (front)
     * b f g c (right)
     * e a d h (left)
     * e f b a (top)
     * d c g h (bottom)
     * f e h g (back)
     */

    const a = [-hw, hh, hl];
    const b = [hw, hh, hl];
    const c = [hw, -hh, hl];
    const d = [-hw, -hh, hl];
    const e = [-hw, hh, -hl];
    const f = [hw, hh, -hl];
    const g = [hw, -hh, -hl];
    const h = [-hw, -hh, -hl];

    const extrapolationFactor = 100;

    // prettier-ignore
    const vertices = new Float32Array([
        ...quadFromPointsExtrapolated(a,d,c,b, extrapolationFactor), // front
        ...quadFromPointsExtrapolated(b,c,g,f, extrapolationFactor), // right
        ...quadFromPointsExtrapolated(e,h,d,a, extrapolationFactor), // left
        ...quadFromPointsExtrapolated(e,a,b,f, extrapolationFactor), // top
        ...quadFromPointsExtrapolated(g,c,d,h, extrapolationFactor), // bottom
        ...quadFromPointsExtrapolated(f,g,h,e,extrapolationFactor)  // back
    ]);

    const tTopLeft = [0, 0];
    const tBottomLeft = [0, 1];
    const tTopRight = [1, 0];
    const tBottomRight = [1, 1];

    const faceTexCoord = quadFromCoordExtrapolated(
      tTopLeft,
      tBottomLeft,
      tBottomRight,
      tTopRight,
      extrapolationFactor
    );

    const texcoord = new Float32Array([
      ...faceTexCoord,
      ...faceTexCoord,
      ...faceTexCoord,
      ...faceTexCoord,
      ...faceTexCoord,
      ...faceTexCoord
    ]);

    super({
      position: new BufferAttribute(vertices, 3),
      texcoord: new BufferAttribute(texcoord, 2)
    });

    this.width = width;
    this.height = height;
    this.length = length;
  }

  toJSON(withNodeAttributes: boolean = true): BoxGeometrySerialized {
    const data: BoxGeometrySerialized = {
      height: this.height,
      width: this.width,
      length: this.length
    } as BoxGeometrySerialized;

    if (withNodeAttributes) {
      // @ts-ignore
      data.attributes = {};

      for (const key of Object.keys(this.attributes)) {
        const value = this.attributes[key];

        if (value) {
          if (value instanceof BufferAttribute) {
            data.attributes[key] = value.toJSON();
          } else {
            // @ts-ignore
            data.attributes[key] = value;
          }
        }
      }
    }

    return data;
  }

  public static fromJSON(data: BoxGeometryProps): BoxGeometry {
    return new BoxGeometry(data.width, data.height, data.length);
  }
}
