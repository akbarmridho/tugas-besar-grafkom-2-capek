import {
  BufferGeometry,
  BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';

export interface SphereGeometryProps {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
}

export type SphereGeometrySerialized = BufferGeometrySerialized &
  SphereGeometryProps;

export class SphereGeometry extends BufferGeometry<SphereGeometrySerialized> {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  phiStart: number;
  phiLength: number;
  thetaStart: number;
  thetaLength: number;

  constructor(
    radius: number = 1,
    widthSegments: number = 32,
    heightSegments: number = 16,
    phiStart: number = 0,
    phiLength: number = Math.PI * 2,
    thetaStart: number = 0,
    thetaLength: number = Math.PI
  ) {
    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);
    const grid: number[][] = [];

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    let index = 0;

    // Generate vertices, normals, and uvs
    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow: number[] = [];
      const v = iy / heightSegments;

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        const x =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);
        const y = radius * Math.cos(thetaStart + v * thetaLength);
        const z =
          radius *
          Math.sin(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);

        vertices.push(x, y, z);

        const nx = x / radius;
        const ny = y / radius;
        const nz = z / radius;

        normals.push(nx, ny, nz);

        uvs.push(u, 1 - v); // Flip V coordinate

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // Generate 0
    const triangles: number[] = [];
    const triangleNormals: number[] = [];
    const triangleUVs: number[] = [];
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) {
          triangles.push(
            vertices[a * 3],
            vertices[a * 3 + 1],
            vertices[a * 3 + 2],
            vertices[b * 3],
            vertices[b * 3 + 1],
            vertices[b * 3 + 2],
            vertices[d * 3],
            vertices[d * 3 + 1],
            vertices[d * 3 + 2]
          );
          triangleNormals.push(
            normals[a * 3],
            normals[a * 3 + 1],
            normals[a * 3 + 2],
            normals[b * 3],
            normals[b * 3 + 1],
            normals[b * 3 + 2],
            normals[d * 3],
            normals[d * 3 + 1],
            normals[d * 3 + 2]
          );
          triangleUVs.push(
            uvs[a * 2],
            uvs[a * 2 + 1],
            uvs[b * 2],
            uvs[b * 2 + 1],
            uvs[d * 2],
            uvs[d * 2 + 1]
          );
        }
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
          triangles.push(
            vertices[b * 3],
            vertices[b * 3 + 1],
            vertices[b * 3 + 2],
            vertices[c * 3],
            vertices[c * 3 + 1],
            vertices[c * 3 + 2],
            vertices[d * 3],
            vertices[d * 3 + 1],
            vertices[d * 3 + 2]
          );
          triangleNormals.push(
            normals[b * 3],
            normals[b * 3 + 1],
            normals[b * 3 + 2],
            normals[c * 3],
            normals[c * 3 + 1],
            normals[c * 3 + 2],
            normals[d * 3],
            normals[d * 3 + 1],
            normals[d * 3 + 2]
          );
          triangleUVs.push(
            uvs[b * 2],
            uvs[b * 2 + 1],
            uvs[c * 2],
            uvs[c * 2 + 1],
            uvs[d * 2],
            uvs[d * 2 + 1]
          );
        }
      }
    }

    super({
      position: new BufferAttribute(new Float32Array(triangles), 3),
      normal: new BufferAttribute(new Float32Array(triangleNormals), 3),
      texcoord: new BufferAttribute(new Float32Array(triangleUVs), 2)
    });

    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.phiStart = phiStart;
    this.phiLength = phiLength;
    this.thetaStart = thetaStart;
    this.thetaLength = thetaLength;
  }

  toJSON(withNodeAttributes: boolean = true): SphereGeometrySerialized {
    const data: SphereGeometrySerialized = {
      radius: this.radius,
      widthSegments: this.widthSegments,
      heightSegments: this.heightSegments,
      phiStart: this.phiStart,
      phiLength: this.phiLength,
      thetaStart: this.thetaStart,
      thetaLength: this.thetaLength,
      attributes: {
        position: this.attributes.position.toJSON(),
        normal: this.attributes.normal.toJSON(),
        // @ts-ignore
        texcoord: this.attributes.texcoord.toJSON()
      }
    } as SphereGeometrySerialized;

    if (withNodeAttributes) {
      // @ts-ignore
      data.attributes = {};
      for (const key of Object.keys(this.attributes)) {
        const value = this.attributes[key];
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

  static fromJSON(data: SphereGeometryProps): SphereGeometry {
    return new SphereGeometry(
      data.radius,
      data.widthSegments,
      data.heightSegments,
      data.phiStart,
      data.phiLength,
      data.thetaStart,
      data.thetaLength
    );
  }
}
