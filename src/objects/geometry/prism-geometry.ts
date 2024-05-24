import {
    BufferGeometry,
    BufferGeometrySerialized
} from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';
import { quadFromCoord } from '@/utils/coordinates.ts';

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
            polygonVert[i][1] = -hh;
            polygonVert[(i+1) % numVert][1] = -hh;
            polygonVert[(i+2) % numVert][1] = -hh;
            verts.push(...polygonVert[i]);
            verts.push(...polygonVert[(i + 1) % numVert]);
            verts.push(...polygonVert[(i + 2) % numVert]);

            // Top face
            polygonVert[i][1] = hh;
            polygonVert[(i+1) % numVert][1] = hh;
            polygonVert[(i+2) % numVert][1] = hh;
            verts.push(...polygonVert[i]);
            verts.push(...polygonVert[(i + 1) % numVert]);
            verts.push(...polygonVert[(i + 2) % numVert]);
        }

        for (let i = 0; i < numVert; i++) {
            // Triangle 1
            polygonVert[i][1] = -hh;
            verts.push(...polygonVert[i]); // Bottom vertex
            polygonVert[(i+1) % numVert][1] = -hh;
            verts.push(...polygonVert[(i + 1) % numVert]); // The other bottom vertex
            polygonVert[i][1] = hh;
            verts.push(...polygonVert[i]); // Top vertex
            //// Triangle 2
            polygonVert[i][1] = hh;
            verts.push(...polygonVert[i]); // Top vertex
            polygonVert[(i+1) % numVert][1] = -hh;
            verts.push(...polygonVert[(i + 1) % numVert]); // The other bottom vertex
            polygonVert[(i+1) % numVert][1] = hh;
            verts.push(...polygonVert[(i + 1) % numVert]); // The other top vertex
        }

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

        //const texcoord = new Float32Array([
        //    ...faceTexCoord,
        //    ...faceTexCoord,
        //    ...faceTexCoord,
        //    ...faceTexCoord,
        //    ...faceTexCoord,
        //    ...faceTexCoord
        //]);

        const texcoord = new Float32Array((numVert + 2) * faceTexCoord.length);
        for (let i = 0; i < numVert + 2; i++) {
            texcoord.set(faceTexCoord, i * faceTexCoord.length);
        }

        super({
            position: new BufferAttribute(new Float32Array(verts), 3),
            texcoord: new BufferAttribute(texcoord, 2)
        });

        this.polygonVert = polygonVert;
        this.height = height;
    }

    toJSON(withNodeAttributes: boolean = true): PrismGeometrySerialized {
        const data: PrismGeometrySerialized = {
            polygonVert: this.polygonVert,
            height: this.height
        } as PrismGeometrySerialized

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

    public static fromJSON(data: PrismGeometryProps): PrismGeometry {
        return new PrismGeometry(data.polygonVert, data.height);
    }
}
