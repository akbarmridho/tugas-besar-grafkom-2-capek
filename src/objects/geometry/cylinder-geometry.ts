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

                vertices.push(...vertex);
                normals.push(...normal);
            }
        }

        this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));

        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = radialSegments;
        this.heightSegments = heightSegments;
    }

    toJSON(): CylinderGeometrySerialized {
        return {
            radiusTop: this.radiusTop,
            radiusBottom: this.radiusBottom,
            height: this.height,
            radialSegments: this.radialSegments,
            heightSegments: this.heightSegments,
            attributes: {
                position: this.attributes.position.toJSON(),
                normal: this.attributes.normal.toJSON(),
            },
        };
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
