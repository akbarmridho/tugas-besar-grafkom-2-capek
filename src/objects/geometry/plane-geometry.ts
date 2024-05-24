import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { quadFromCoord, quadFromFlatPoints } from '@/utils/coordinates.ts';

export interface PlaneGeometryProps {
  width: number;
  height: number;
}

export type PlaneGeometrySerialized = BufferGeometrySerialized &
  PlaneGeometryProps;

export class PlaneGeometry extends BufferGeometry<PlaneGeometrySerialized> {
  width: number;
  height: number;

  constructor(width: number = 1, height: number = 1) {
    const hw = width / 2;
    const hh = height / 2;

    /**
     * a  d
     * b  c
     *
     * a = -hw, hh
     * b = hw, hh
     * c = -hw, -hh
     * d = hw, -hh
     */

    // prettier-ignore
    const vertices = new Float32Array(quadFromFlatPoints([
          -hw,  hh, 0, // a
          -hw, -hh, 0, // b
           hw, -hh, 0, // c
           hw,  hh, 0, // d
        ]));

    const tTopLeft = [0, 0];
    const tBottomLeft = [0, 1];
    const tTopRight = [1, 0];
    const tBottomRight = [1, 1];

    const faceTexCoord = quadFromCoord(
      tTopLeft,
      tBottomLeft,
      tBottomRight,
      tTopRight
    );

    const texcoord = new Float32Array([...faceTexCoord]);

    super({
      position: new BufferAttribute(vertices, 3),
      texcoord: new BufferAttribute(texcoord, 2)
    });

    this.width = width;
    this.height = height;
  }

  toJSON(withNodeAttributes: boolean = true): PlaneGeometrySerialized {
    const data: PlaneGeometrySerialized = {
      height: this.height,
      width: this.width
    } as PlaneGeometrySerialized;

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

  public static fromJSON(data: PlaneGeometryProps): PlaneGeometry {
    return new PlaneGeometry(data.width, data.height);
  }
}
