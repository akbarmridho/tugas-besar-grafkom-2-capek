// cylinder-geometry.ts
import { BufferGeometry, BufferGeometrySerialized } from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';

export interface CylinderGeometryProps {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
}

export type CylinderGeometrySerialized = BufferGeometrySerialized & CylinderGeometryProps;

export class CylinderGeometry extends BufferGeometry<CylinderGeometrySerialized> {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;

    constructor(
        radiusTop: number = 1,
        radiusBottom: number = 1,
        height: number = 1,
        radialSegments: number = 8,
        heightSegments: number = 1
    ) {
        super({
            position: new BufferAttribute(new Float32Array(0), 3),
            normal: new BufferAttribute(new Float32Array(0), 3),
        });
    
        const vertices = [];
        const normals = [];
        const uvs: number[] = []; 
        const points = [];
    
        const heightHalf = height / 2;
    
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
    
            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * Math.PI * 2;
    
                const vertex = [
                    radius * Math.sin(theta),
                    -v * height + heightHalf,
                    radius * Math.cos(theta)
                ];
    
                const normal = [
                    Math.sin(theta),
                    0,
                    Math.cos(theta)
                ];
    
                points.push(...vertex);
                normals.push(...normal);
            }
        }
    
        // Generate vertices for triangles
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = (x + (radialSegments + 1) * y) * 3;
                const b = (x + (radialSegments + 1) * (y + 1)) * 3;
                const c = ((x + 1) + (radialSegments + 1) * (y + 1)) * 3;
                const d = ((x + 1) + (radialSegments + 1) * y) * 3;
    
                // First triangle
                vertices.push(
                    points[a], points[a + 1], points[a + 2],
                    points[b], points[b + 1], points[b + 2],
                    points[d], points[d + 1], points[d + 2]
                );
    
                // Second triangle
                vertices.push(
                    points[b], points[b + 1], points[b + 2],
                    points[c], points[c + 1], points[c + 2],
                    points[d], points[d + 1], points[d + 2]
                );
            }
        }
    
        this.generateCap(false, vertices, normals, uvs, radialSegments, radiusTop, heightHalf, Math.PI * 2, 0);
        this.generateCap(false, vertices, normals, uvs, radialSegments, radiusBottom, -heightHalf, Math.PI * 2, 0);
    
        this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = radialSegments;
        this.heightSegments = heightSegments;
    }

    generateCap(top: boolean, vertices: number[], normals: number[], uvs: number[], radialSegments: number, radius: number, halfHeight: number, thetaLength: number, thetaStart: number) {
        const sign = top ? -1 : 1; // Adjust sign for top or bottom cap
    
        // Save the index of the first center vertex
        const centerIndexStart = vertices.length / 3;
    
        const uv = { x: 0, y: 0 };
        const vertex = { x: 0, y: 0, z: 0 };
    
        // Generate the center vertex data of the cap
        for (let x = 0; x <= radialSegments; x++) {
            // Vertex
            vertices.push(0, halfHeight * sign, 0);
    
            // Normal
            normals.push(0, sign, 0);
    
            // UV
            uvs.push(0.5, 0.5);
        }
    
        // Save the index of the last center vertex
        const centerIndexEnd = vertices.length / 3;
    
        // Generate the surrounding vertices, normals, and UVs
        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * thetaLength + thetaStart;
    
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
    
            // Vertex
            vertex.x = radius * sinTheta;
            vertex.y = halfHeight * sign;
            vertex.z = radius * cosTheta;
            vertices.push(vertex.x, vertex.y, vertex.z);
    
            // Normal
            normals.push(0, sign, 0);
    
            // UV
            uv.x = (cosTheta * 0.5) + 0.5;
            uv.y = (sinTheta * 0.5 * sign) + 0.5;
            uvs.push(uv.x, uv.y);
        }
    
        // Generate vertices for triangles
        for (let x = 0; x < radialSegments; x++) {
            const a = centerIndexStart + x;
            const b = centerIndexEnd + x;
            const c = centerIndexEnd + x + 1;
            const d = centerIndexStart + x + 1;
    
            // First triangle (top or bottom)
            if (top) {
                vertices.push(
                    vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2],
                    vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2],
                    vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]
                );
            } else {
                vertices.push(
                    vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2],
                    vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2],
                    vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]
                );
            }
    
            // Second triangle (top or bottom)
            if (top) {
                vertices.push(
                    vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2],
                    vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2],
                    vertices[d * 3], vertices[d * 3 + 1], vertices[d * 3 + 2]
                );
            } else {
                vertices.push(
                    vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2],
                    vertices[d * 3], vertices[d * 3 + 1], vertices[d * 3 + 2],
                    vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]
                );
            }
        }
    }    
    
    
    toJSON(withNodeAttributes: boolean = true): CylinderGeometrySerialized {
        const data: CylinderGeometrySerialized = {
            radiusTop: this.radiusTop,
            radiusBottom: this.radiusBottom,
            height: this.height,
            radialSegments: this.radialSegments,
            heightSegments: this.heightSegments,
            attributes: {
                position: this.attributes.position.toJSON(),
                normal: this.attributes.normal.toJSON(),
            },
        } as CylinderGeometrySerialized;

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

    static fromJSON(data: CylinderGeometryProps): CylinderGeometry {
        return new CylinderGeometry(
            data.radiusTop,
            data.radiusBottom,
            data.height,
            data.radialSegments,
            data.heightSegments
        );
    }
}
