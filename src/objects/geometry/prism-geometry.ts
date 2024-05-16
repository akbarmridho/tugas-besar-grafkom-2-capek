import {
    BufferGeometry,
    BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { quadFromPoints } from '@/utils/coordinates.ts';

export interface PrismGeometryProps {
    polygonVert: number[][];
    height: number;
}

export type PrismGeometrySerialized = BufferGeometrySerialized & PrismGeometryProps;

export class PrismGeometry extends BufferGeometry<PrismGeometrySerialized> {
    polygonVert: number[][];
    height: number;

    constructor(polygonVert: number[][], height: number = 1) {
        if (polygonVert.length < 3) {
            throw new Error('ERROR');
        }

        const numVert = polygonVert.length; // Number of vertices at the base polygon
        const hh = height/2;
        const verts = [] // Store every vertex coordinates

        for (let i = 0; i < numVert; i++) {
            // Bottom face
            verts.push(...polygonVert[i], -hh);
            verts.push(...polygonVert[(i + 1) % numVert], -hh);
            verts.push(...polygonVert[(((i + 1) % numVert) + 1) % numVert], -hh);
            // Top face
            verts.push(...polygonVert[i], hh);
            verts.push(...polygonVert[(i + 1) % numVert], hh);
            verts.push(...polygonVert[(((i + 1) % numVert) + 1) % numVert], hh);
        }

        for (let i = 0; i < numVert; i++) {
            // Triangle 1
            verts.push(...polygonVert[i], -hh); // Bottom vertex
            verts.push(...polygonVert[(i + 1) % numVert], -hh); // The other bottom vertex
            verts.push(...polygonVert[i], hh); // Top vertex
            // Triangle 2
            verts.push(...polygonVert[i], hh); // Top vertex
            verts.push(...polygonVert[(i + 1) % numVert], hh); // The other top vertex
            verts.push(...polygonVert[(i + 1) % numVert], -hh); // The other bottom vertex
        }
        super({position: new BufferAttribute(new Float32Array(verts), 3)});

        this.polygonVert = polygonVert;
        this.height = height;
    }

    toJSON(): PrismGeometrySerialized {
        const data: PrismGeometrySerialized = {
            attributes: {},
            polygonVert: this.polygonVert,
            height: this.height
        } as PrismGeometrySerialized;

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
          } return data;
    }

    public static fromJSON(data: PrismGeometryProps): PrismGeometry {
        return new PrismGeometry(data.polygonVert, data.height);
    }
}
