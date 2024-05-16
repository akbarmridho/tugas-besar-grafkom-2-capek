import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { quadFromPoints } from '@/utils/coordinates.ts';

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

    // prettier-ignore
    const vertices = new Float32Array([
        ...quadFromPoints(a,b,c,d),
        ...quadFromPoints(b,f,g,c),
        ...quadFromPoints(e,a,d,h),
        ...quadFromPoints(e,f,b,a),
        ...quadFromPoints(d,c,g,h),
        ...quadFromPoints(f,e,h,g)
    ])

    super({
      position: new BufferAttribute(vertices, 3)
    });

    this.width = width;
    this.height = height;
    this.length = length;
  }

  toJSON(): BoxGeometrySerialized {
    const data: BoxGeometrySerialized = {
      attributes: {},
      height: this.height,
      width: this.width,
      length: this.length
    } as BoxGeometrySerialized;

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

    return data;
  }
}
