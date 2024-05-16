import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { quadFromFlatPoints } from '@/utils/coordinates.ts';

export interface PlaneGeometrySerialized extends BufferGeometrySerialized {
  width: number;
  height: number;
}

export class PlaneGeometry extends BufferGeometry<PlaneGeometrySerialized> {
  width: number;
  height: number;

  constructor(width: number = 1, height: number = 1) {
    const hw = width / 2;
    const hh = height / 2;

    /**
     * a  b
     * c  d
     *
     * a = -hw, hh
     * b = hw, hh
     * c = -hw, -hh
     * d = hw, -hh
     */

    // prettier-ignore
    const vertices = new Float32Array(quadFromFlatPoints([
          -hw,  hh, 0,
           hw,  hh, 0,
          -hw, -hh, 0,
           hw, -hh, 0,
        ]))

    super({
      position: new BufferAttribute(vertices, 3)
    });

    this.width = width;
    this.height = height;
  }

  toJSON(): PlaneGeometrySerialized {
    const data: PlaneGeometrySerialized = {
      attributes: {},
      height: this.height,
      width: this.width
    } as PlaneGeometrySerialized;

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
