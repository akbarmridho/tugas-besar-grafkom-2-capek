import { Camera } from '@/objects/base/camera.ts';
import { NodeSerialized } from '@/objects/base/node.ts';
import { Vector3 } from '@/utils/math/vector3.ts';
import { Euler } from '@/utils/math/euler.ts';
import { Transformation } from '@/utils/math/transformation.ts';
import { Matrix4 } from '@/utils/math/matrix4.ts';

export interface CubeProjection {
  near: number;
  far: number;
}

export interface CubeCameraSerialized extends NodeSerialized {
  projection: CubeProjection;
}

export class CubeCamera extends Camera<CubeCameraSerialized> {
    _baseProjection: CubeProjection;
    projectionMatrices: Matrix4[];

    constructor(
        name: string,
        projection: CubeProjection = {
            near: 0.1,
            far: 1000
        },
        position?: Vector3,
        rotation?: Euler,
        scale?: Vector3
    ) {
        super(name, position, rotation, scale); // Setup Node
        this._baseProjection = projection;
        this.projectionMatrices = [];
        this.computeProjectionMatrices();
    }

    get baseProjection() {
        return this._baseProjection;
    }

    set baseProjection(val: CubeProjection) {
        this._baseProjection = val;
        this.computeProjectionMatrices();
    }

    computeProjectionMatrices() {
        // Define the six directions for cube rendering
        const directions: Vector3[] = [
            new Vector3(1, 0, 0),  // Right
            new Vector3(-1, 0, 0), // Left
            new Vector3(0, 1, 0),  // Top
            new Vector3(0, -1, 0), // Bottom
            new Vector3(0, 0, 1),  // Front
            new Vector3(0, 0, -1)  // Back
        ];

        // Compute projection matrix for each direction
        this.projectionMatrices = directions.map(direction => {
            return Transformation.lookAt(this.position, direction, new Vector3(0, 1, 0)).inverse();
        });
    }

    currentDirectionIndex: number = 0;

    computeProjectionMatrix(): Matrix4 {
            // Make sure projectionMatrices array is not empty
            if (this.projectionMatrices.length === 0) {
                throw new Error('Projection matrices array is empty');
            }
        
            // Return the projection matrix corresponding to the current direction index
            return this.projectionMatrices[this.currentDirectionIndex];
        }
      

    public toJSON(): CubeCameraSerialized {
        return {
            projection: { ...this._baseProjection },
            ...this.toNodeSerialized()
        };
    }

    public static fromJSON(name: string, data: CubeProjection) {
        return new CubeCamera(name, data);
    }
}
