import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { triangleFromPoints } from '@/utils/coordinates.ts';
import { quadFromCoord, quadFromPoints } from '@/utils/coordinates.ts';

export interface PyramidGeometryProps {
    width: number;
    height: number;
    length: number;
}

export type PyramidGeometrySerialized = BufferGeometrySerialized & PyramidGeometryProps;

export class PyramidGeometry extends BufferGeometry<PyramidGeometrySerialized> {
    width: number;
    height: number;
    length: number;

    constructor(
        width: number = 1,
        height: number = 1,
        length: number = 1
    ) {
        const hw = width/2;
        const hh = height/2;
        const hl = length/2;

        /**
         * Pyramid
         *      a
         *     / \ヽ
         *    / | \  ヽ
         *   /  c -\---- d
         *  / ⁄     \  ⁄
         * b ------- e
         * 
         * five faces
         * a b e (front)
         * a b c (left)
         * a d e (right)
         * a c d (back)
         * b c d e (bottom)
         */

        const a = [0, hh, 0];
        const b = [-hw, -hh, hl];
        const c = [-hw, -hh, -hl];
        const d = [hw, -hh, -hl];
        const e = [hw, -hh, hl];

        const vertices = new Float32Array([
            ...quadFromPoints(b, c, d, e),
            ...triangleFromPoints(a, c, b),
            ...triangleFromPoints(a, b, e),
            ...triangleFromPoints(a, e, d),
            ...triangleFromPoints(a, d, c)
        ]);

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

        const texcoord = new Float32Array([
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

    toJSON(withNodeAttributes: boolean = true): PyramidGeometrySerialized {
        const data: PyramidGeometrySerialized =  {
            height: this.height,
            width: this.width,
            length: this.length
        } as PyramidGeometrySerialized

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
        } return data;
    }

    public static fromJSON(data: PyramidGeometryProps): PyramidGeometry {
        return new PyramidGeometry(data.width, data.height, data.length);
    }
}