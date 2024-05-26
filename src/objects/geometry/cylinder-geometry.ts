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
            texcoord: new BufferAttribute(new Float32Array(0), 2),
        });

        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = Math.max(3, radialSegments);
        this.heightSegments = Math.max(1, heightSegments);

        const vertices: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        const points: number[] = [];

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

                // UV coordinates
                uvs.push(u, 1 - v);
            }
        }

        // Generate vertices for triangles
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = x + (radialSegments + 1) * y;
                const b = x + (radialSegments + 1) * (y + 1);
                const c = (x + 1) + (radialSegments + 1) * (y + 1);
                const d = (x + 1) + (radialSegments + 1) * y;

                // First triangle
                vertices.push(
                    points[a * 3], points[a * 3 + 1], points[a * 3 + 2],
                    points[b * 3], points[b * 3 + 1], points[b * 3 + 2],
                    points[d * 3], points[d * 3 + 1], points[d * 3 + 2]
                );

                normals.push(
                    points[a * 3], points[a * 3 + 1], points[a * 3 + 2],
                    points[b * 3], points[b * 3 + 1], points[b * 3 + 2],
                    points[d * 3], points[d * 3 + 1], points[d * 3 + 2]
                );

                uvs.push(
                    uvs[a * 2], uvs[a * 2 + 1],
                    uvs[b * 2], uvs[b * 2 + 1],
                    uvs[d * 2], uvs[d * 2 + 1]
                );

                // Second triangle
                vertices.push(
                    points[b * 3], points[b * 3 + 1], points[b * 3 + 2],
                    points[c * 3], points[c * 3 + 1], points[c * 3 + 2],
                    points[d * 3], points[d * 3 + 1], points[d * 3 + 2]
                );

                normals.push(
                    points[b * 3], points[b * 3 + 1], points[b * 3 + 2],
                    points[c * 3], points[c * 3 + 1], points[c * 3 + 2],
                    points[d * 3], points[d * 3 + 1], points[d * 3 + 2]
                );

                uvs.push(
                    uvs[b * 2], uvs[b * 2 + 1],
                    uvs[c * 2], uvs[c * 2 + 1],
                    uvs[d * 2], uvs[d * 2 + 1]
                );
            }
        }

        this.generateCap(false, vertices, normals, uvs, radialSegments, radiusTop, heightHalf, Math.PI * 2, 0);
        this.generateCap(false, vertices, normals, uvs, radialSegments, radiusBottom, -heightHalf, Math.PI * 2, 0);

        this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('texcoord', new BufferAttribute(new Float32Array(uvs), 2));
    }

    generateCap(top: boolean, vertices: number[], normals: number[], uvs: number[], radialSegments: number, radius: number, halfHeight: number, thetaLength: number, thetaStart: number) {
        const sign = top ? 1 : -1; // Adjust sign for top or bottom cap

        // Save the index of the first center vertex
        const centerIndexStart = vertices.length / 3;

        // Center vertex
        vertices.push(0, halfHeight * sign, 0);
        normals.push(0, sign, 0);
        uvs.push(0.5, 0.5);

        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * thetaLength + thetaStart;

            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            const vertex = {
                x: radius * sinTheta,
                y: halfHeight * sign,
                z: radius * cosTheta,
            };

            vertices.push(vertex.x, vertex.y, vertex.z);
            normals.push(0, sign, 0);

            uvs.push((cosTheta * 0.5) + 0.5, (sinTheta * 0.5 * sign) + 0.5);
        }

        for (let x = 0; x < radialSegments; x++) {
            const c = centerIndexStart;
            const i = centerIndexStart + x + 1;
            const j = i + 1;

            if (top) {
                vertices.push(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2],
                              vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2],
                              vertices[j * 3], vertices[j * 3 + 1], vertices[j * 3 + 2]);

                normals.push(normals[c * 3], normals[c * 3 + 1], normals[c * 3 + 2],
                             normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2],
                             normals[j * 3], normals[j * 3 + 1], normals[j * 3 + 2]);

                uvs.push(uvs[c * 2], uvs[c * 2 + 1],
                         uvs[i * 2], uvs[i * 2 + 1],
                         uvs[j * 2], uvs[j * 2 + 1]);
            } else {
                vertices.push(vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2],
                              vertices[j * 3], vertices[j * 3 + 1], vertices[j * 3 + 2],
                              vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);

                normals.push(normals[c * 3], normals[c * 3 + 1], normals[c * 3 + 2],
                             normals[j * 3], normals[j * 3 + 1], normals[j * 3 + 2],
                             normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]);

                uvs.push(uvs[c * 2], uvs[c * 2 + 1],
                         uvs[j * 2], uvs[j * 2 + 1],
                         uvs[i * 2], uvs[i * 2 + 1]);
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
                // @ts-ignore
                texcoord: this.attributes.texcoord.toJSON(),
            },
        } as CylinderGeometrySerialized;

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
