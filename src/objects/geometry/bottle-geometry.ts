import { BufferAttribute } from '../base/buffer-attribute';
import { BufferGeometry, BufferGeometrySerialized } from '../base/buffer-geometry';

export interface BottleGeometryProps {}
export type BottleGeometrySerialized = BufferGeometrySerialized & BottleGeometryProps;

export class BottleGeometry extends BufferGeometry<BottleGeometrySerialized> {
  constructor() {
    const vertices = new Float32Array([
      // Bottom face
      -0.3, -1.5, -0.3,  -0.3, -1.5, 0.3,  0.3, -1.5, 0.3,  0.3, -1.5, -0.3,
      // Bottom face inner ring
      -0.2, -1.45, -0.2,  -0.2, -1.45, 0.2,  0.2, -1.45, 0.2,  0.2, -1.45, -0.2,
      // Side faces
      -0.3, -1.5, -0.3,  -0.3, -1.5, 0.3,  -0.2, -1.45, 0.2,  -0.2, -1.45, -0.2,
      -0.3, -1.5, 0.3,   0.3, -1.5, 0.3,   0.2, -1.45, 0.2,   -0.2, -1.45, 0.2,
      0.3, -1.5, 0.3,    0.3, -1.5, -0.3,  0.2, -1.45, -0.2,  0.2, -1.45, 0.2,
      0.3, -1.5, -0.3,   -0.3, -1.5, -0.3, -0.2, -1.45, -0.2, 0.2, -1.45, -0.2,
      // Bottle body
      -0.3, -1.5, -0.3,  -0.3, -0.5, -0.3, 0.3, -0.5, -0.3,  0.3, -1.5, -0.3,
      -0.3, -1.5, 0.3,   -0.3, -0.5, 0.3,  0.3, -0.5, 0.3,   0.3, -1.5, 0.3,
      // Bottle body inner ring
      -0.2, -1.45, -0.2, -0.2, -0.55, -0.2, 0.2, -0.55, -0.2, 0.2, -1.45, -0.2,
      -0.2, -1.45, 0.2,  -0.2, -0.55, 0.2,  0.2, -0.55, 0.2,  0.2, -1.45, 0.2,
      // Bottle neck
      -0.15, -0.5, -0.15, -0.15, 0.5, -0.15, 0.15, 0.5, -0.15, 0.15, -0.5, -0.15,
      -0.15, -0.5, 0.15,  -0.15, 0.5, 0.15,  0.15, 0.5, 0.15,  0.15, -0.5, 0.15,
      // Bottle neck inner ring
      -0.1, -0.45, -0.1, -0.1, 0.45, -0.1, 0.1, 0.45, -0.1, 0.1, -0.45, -0.1,
      -0.1, -0.45, 0.1,  -0.1, 0.45, 0.1,  0.1, 0.45, 0.1,  0.1, -0.45, 0.1,
      // Bottle top
      -0.15, 0.5, -0.15,  -0.15, 0.55, -0.15, 0.15, 0.55, -0.15, 0.15, 0.5, -0.15,
      -0.15, 0.5, 0.15,   -0.15, 0.55, 0.15,  0.15, 0.55, 0.15,  0.15, 0.5, 0.15,
      // Bottle top inner ring
      -0.1, 0.45, -0.1,  -0.1, 0.5, -0.1, 0.1, 0.5, -0.1, 0.1, 0.45, -0.1,
      -0.1, 0.45, 0.1,   -0.1, 0.5, 0.1,  0.1, 0.5, 0.1,  0.1, 0.45, 0.1
    ]);

    const normals = new Float32Array([
      // Bottom face normals
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
      // Bottom face inner ring normals
      0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
      // Side faces normals
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
      0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
      // Bottle body normals
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
      0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
      // Bottle neck normals
      0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
      // Bottle top normals
      0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    ]);

    super({
        position: new BufferAttribute(vertices, 3),
        normal: new BufferAttribute(normals, 3),
        texcoord: new BufferAttribute(new Float32Array(0), 2)
      })
  }

  public toJSON(withNodeAttributes: boolean = true): BottleGeometrySerialized {
    const data: BottleGeometrySerialized = {} as BottleGeometrySerialized;

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

  public static fromJSON(data: BottleGeometryProps): BottleGeometry {
    return new BottleGeometry();
  }
}
