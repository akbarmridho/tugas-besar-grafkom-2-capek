import { BufferGeometry, BufferGeometrySerialized } from '@/objects/base/buffer-geometry.ts';
import { BufferAttribute } from '@/objects/base/buffer-attribute.ts';

export interface SphereGeometryProps {
    radius: number;
    widthSegments: number;
    heightSegments: number;
}

export type SphereGeometrySerialized = BufferGeometrySerialized & SphereGeometryProps;

export class SphereGeometry extends BufferGeometry<SphereGeometrySerialized> {
    radius: number;
    widthSegments: number;
    heightSegments: number;

    constructor(radius: number = 1, widthSegments: number = 8, heightSegments: number = 6) {
        super({
            position: new BufferAttribute(new Float32Array(0), 3),
            normal: new BufferAttribute(new Float32Array(0), 3),
        });

        const vertices = [];
        const normals = [];

        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const theta = v * Math.PI;

            for (let x = 0; x <= widthSegments; x++) {
                const u = x / widthSegments;
                const phi = u * Math.PI * 2;

                const vertex = [
                    -radius * Math.cos(phi) * Math.sin(theta),
                    radius * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta)
                ];

                const normal = [
                    vertex[0] / radius,
                    vertex[1] / radius,
                    vertex[2] / radius
                ];

                vertices.push(...vertex);
                normals.push(...normal);
            }
        }

        this.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
    }

    toJSON(withNodeAttributes: boolean = true): SphereGeometrySerialized {
        const data: SphereGeometrySerialized = {
            radius: this.radius,
            widthSegments: this.widthSegments,
            heightSegments: this.heightSegments,
            attributes: {
                position: this.attributes.position.toJSON(),
                normal: this.attributes.normal.toJSON(),
            },
        } as SphereGeometrySerialized

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

    static fromJSON(data: SphereGeometryProps): SphereGeometry {
        return new SphereGeometry(data.radius, data.widthSegments, data.heightSegments);
    }
}
